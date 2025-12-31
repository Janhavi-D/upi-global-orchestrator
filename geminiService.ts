import { GoogleGenAI, Type } from "@google/genai";
import { FX_RATES, NIPL_COUNTRIES } from "./constants";

/**
 * Executes high-performance OCR using gemini-3-flash-preview.
 * Designed for sub-second parsing of global payment metadata.
 */
export const parseReceipt = async (base64Image: string) => {
  /* Initializing GoogleGenAI client strictly following guidelines: const ai = new GoogleGenAI({apiKey: process.env.API_KEY}); */
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: "Analyze this receipt. Output a JSON object. Fields: merchantName (string), country (string), currency (ISO 3-letter code), subtotal (number), tax (number), total (number). Return ONLY the raw JSON object, no markdown code blocks or extra text." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchantName: { type: Type.STRING },
            country: { type: Type.STRING },
            currency: { type: Type.STRING },
            subtotal: { type: Type.NUMBER },
            tax: { type: Type.NUMBER },
            total: { type: Type.NUMBER }
          },
          required: ["merchantName", "total"]
        }
      }
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error("TERMINAL_EMPTY_RESPONSE: The AI node returned an empty signal.");
    }

    let data: any;
    try {
      const cleanJson = rawText.trim().replace(/^```json/, '').replace(/```$/, '').trim();
      data = JSON.parse(cleanJson);
    } catch (parseErr) {
      // Robust regex fallback for unstructured outputs
      const jsonRegex = /\{[\s\S]*\}/;
      const match = rawText.match(jsonRegex);
      if (match) {
        data = JSON.parse(match[0]);
      } else {
        throw new Error("HANDSHAKE_PARSE_FAILURE: The vision payload could not be decoded as JSON.");
      }
    }
    
    // Normalize data fields with sensible defaults
    const subtotalValue = Number(data.subtotal) || 0;
    const taxValue = Number(data.tax) || 0;
    const totalValue = Number(data.total) || (subtotalValue + taxValue);

    if (!totalValue || totalValue <= 0) {
      throw new Error("ZERO_AMOUNT_ABORT: The scanner was unable to detect a valid payable amount.");
    }

    const currencyCode = (data.currency || 'USD').toUpperCase().trim();
    const fx = FX_RATES[currencyCode] || FX_RATES['USD'];
    
    // Country normalization for NIPL detection
    const countryName = data.country || 'International';
    const isNIPL = NIPL_COUNTRIES.some(c => 
      countryName.toLowerCase().includes(c.toLowerCase()) || 
      (data.merchantName || '').toLowerCase().includes(c.toLowerCase())
    );

    return {
      merchantName: data.merchantName || 'External Global Merchant',
      country: countryName,
      originalCurrency: fx.code,
      originalAmount: totalValue,
      subtotal: subtotalValue || totalValue,
      tax: taxValue,
      inrAmount: totalValue * fx.rate,
      isNIPL
    };
  } catch (err: any) {
    console.error("Node Orchestration Critical Error:", err);
    throw err;
  }
};
