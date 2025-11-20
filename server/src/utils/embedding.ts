import OpenAI from "openai";

const voyage = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, 
  baseURL: "https://api.voyageai.com/v1",
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const cleaned = text.replace(/\n/g, " ").trim();

  const response = await voyage.embeddings.create({
    model: "voyage-3.5-lite",
    input: cleaned,
  });

  return response.data[0].embedding;
}
