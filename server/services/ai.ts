import { z } from "zod";

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

const responseSchema = z.object({
  choices: z.array(z.object({
    message: z.object({
      content: z.string(),
      role: z.string()
    })
  })),
  citations: z.array(z.string()).optional()
});

export async function askMedicalQuestion(question: string) {
  if (!process.env.PERPLEXITY_API_KEY) {
    throw new Error("Missing PERPLEXITY_API_KEY");
  }

  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable medical AI assistant focused on cancer care. Provide accurate, evidence-based information while being empathetic. Always cite sources when possible. If unsure, acknowledge limitations and recommend consulting healthcare providers."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.2,
        max_tokens: 2048,
        search_domain_filter: ["nih.gov", "cancer.gov", "who.int", "mayoclinic.org", "cancer.org"],
        return_citations: true
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = responseSchema.parse(data);

    return {
      answer: parsed.choices[0].message.content,
      citations: data.citations || []
    };
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("Failed to get AI response");
  }
}