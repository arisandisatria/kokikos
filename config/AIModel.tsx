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



// const {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } = require("@google/generative-ai");

// const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-3-flash-preview",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "application/json",
// };

// export const generateTopicsAiModel = model.startChat({
//   generationConfig,
//   history: [],
// });

// export const generateCourseAiModel = model.startChat({
//   generationConfig,
//   history: [],
// });

// export const generateNewQuizAiModel = model.startChat({
//   generationConfig,
//   history: [],
// });
// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
