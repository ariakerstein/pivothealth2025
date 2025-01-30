import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
export async function translateMedicalDocument(
  documentContent: string,
  targetLanguage: string = "English"
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a medical document translator with expertise in medical terminology and healthcare documentation. Translate the text while preserving medical accuracy and maintaining the original formatting."
        },
        {
          role: "user",
          content: `Please translate the following medical document to ${targetLanguage}. Preserve all medical terms, measurements, and formatting:\n\n${documentContent}`
        }
      ],
      temperature: 0.3, // Lower temperature for more accurate translations
      max_tokens: 4000
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate document");
  }
}
