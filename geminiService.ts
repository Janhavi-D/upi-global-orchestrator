
import { GoogleGenAI } from "@google/genai";
import { FX_RATES, NIPL_COUNTRIES } from "./constants";

/**
 * Executes OCR on the provided receipt image.
 * COMPATIBILITY NOTE: The 'gemini-2.5-flash-image' model (Nano Banana series) 
 * does NOT support responseMimeType: "application/json" or responseSchema.
 * We must prompt for JSON and parse the raw text output.
 */
export const parseReceipt = async (base64Image: string) => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY_MISSING: The system core is not initialized with a valid key.");
  }

  // Initializing fresh instance to ensure correct API key usage
  const ai = new GoogleGenAI({ apiKey });
  
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("GATEWAY_TIMEOUT: The OCR node failed to respond within 25 seconds.")), 25000)
  );

  const requestPromise = ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: "Analyze this receipt and return ONLY a valid, minified JSON object. Keys: merchantName (string), country (string), currency (string, ISO code e.g. USD), subtotal (number), tax (number), total (number). Do not include any text before or after the JSON. If values are unclear, make your best logical estimate based on the context." }
      ]
    }
    // config: {} is omitted entirely to prevent any internal flags that cause 400 errors
  });

  try {
    const response = (await Promise.race([requestPromise, timeoutPromise])) as any;
    
    // Using the .text property directly as per guidelines
    const rawText = response.text || '';
    
    // Extract JSON string using a regex to handle potential markdown wrappers like ```json
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", rawText);
      throw new Error("DATA_EXTRACTION_FAILED: No structured data detected.");
    }

    const jsonString = jsonMatch[0];
    let data: any;
    
    try {
      data = JSON.parse(jsonString.trim());
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr, "Content:", jsonString);
      throw new Error("DATA_PARSING_ERROR: The output format was corrupted.");
    }
    
    // Normalization logic
    const finalTotal = Number(data?.total) || (Number(data?.subtotal) || 0) + (Number(data?.tax) || 0);
    const detectedCurrency = (data?.currency || 'USD').toUpperCase();
    const fx = FX_RATES[detectedCurrency] || FX_RATES['USD'];
    
    const isNIPL = NIPL_COUNTRIES.some(c => 
      data?.country?.toLowerCase()?.includes(c.toLowerCase()) || 
      data?.merchantName?.toLowerCase()?.includes(c.toLowerCase())
    );

    return {
      merchantName: data?.merchantName || 'Unknown Merchant',
      country: data?.country || 'Global Node',
      originalCurrency: fx.code,
      originalAmount: finalTotal,
      subtotal: Number(data?.subtotal) || finalTotal,
      tax: Number(data?.tax) || 0,
      inrAmount: finalTotal * fx.rate,
      isNIPL
    };
  } catch (error: any) {
    if (error.message?.includes("INVALID_ARGUMENT") || error.message?.includes("JSON mode")) {
      throw new Error("MODEL_CONFIG_CONFLICT: The scanning engine parameters were rejected. Please verify model capability.");
    }
    throw error;
  }
};
