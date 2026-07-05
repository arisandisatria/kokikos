import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY });

export async function askGemini(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gagal memanggil AI:", error);
    return "Maaf, terjadi kesalahan saat menghubungi AI.";
  }
}