
import { GoogleGenAI, Type } from "@google/genai";
import { FX_RATES, NIPL_COUNTRIES } from "./constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const parseReceipt = async (base64Image: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: "Extract merchant name, country, currency (ISO code), subtotal, tax, and total amount from this receipt. If information is missing, infer logically. Output strictly JSON." }
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
        required: ["merchantName", "country", "currency", "total"]
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  
  // Math Shield: Extract Subtotal + Tax. If Sum != Scanned_Total, override and use Sum.
  const calculatedTotal = (data?.subtotal || 0) + (data?.tax || 0);
  const finalTotal = calculatedTotal > 0 && calculatedTotal !== data?.total ? calculatedTotal : (data?.total || 0);
  
  const fx = FX_RATES[data?.currency || 'USD'] || FX_RATES['USD'];
  const isNIPL = NIPL_COUNTRIES.some(c => data?.country?.toLowerCase()?.includes(c.toLowerCase()));

  return {
    merchantName: data?.merchantName || 'Unknown Merchant',
    country: data?.country || 'Unknown Locale',
    originalCurrency: fx.code,
    originalAmount: finalTotal,
    subtotal: data?.subtotal || finalTotal,
    tax: data?.tax || 0,
    inrAmount: finalTotal * fx.rate,
    isNIPL
  };
};
