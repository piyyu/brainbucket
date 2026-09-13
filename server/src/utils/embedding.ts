import OpenAI from "openai";

function getVoyage(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY (Voyage key) is not set");
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://api.voyageai.com/v1",
  });
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const cleaned = text.replace(/\n/g, " ").trim();
  if (!cleaned) {
    throw new Error("Cannot generate embedding for empty text");
  }

  const voyage = getVoyage();
  const response = await voyage.embeddings.create({
    model: process.env.VOYAGE_MODEL || "voyage-3.5-lite",
    input: cleaned,
  });

  return response.data[0].embedding;
}
