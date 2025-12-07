import { Request, Response } from "express";
import Content from "../models/content.model";
import { generateEmbedding } from "../utils/embedding.js";
import { askGroq } from "../utils/groq";
import Groq from "groq-sdk";

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] ** 2;
    magB += b[i] ** 2;
  }

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

async function retrieveRelevantContent(userId: string, queryEmbedding: number[]) {
  const allContents = await Content.find({ userId });

  const valid = allContents.filter(
    (c) => Array.isArray(c.embedding) && c.embedding.length > 0
  );

  return valid
    .map((c) => ({
      content: c,
      similarity: cosineSimilarity(queryEmbedding, c.embedding as number[]),
    }))
    .sort((a, b) => b.similarity - a.similarity);
}

const createContent = async (req: Request, res: Response) => {
  const { title, link, description } = req.body;

  try {
    const textToEmbed = `${title} ${description || ""} ${link || ""}`;
    const embedding = await generateEmbedding(textToEmbed);

    const newContent = await Content.create({
      title,
      link,
      description,
      embedding,
      // @ts-ignore
      userId: req.userId,
      tags: [],
    });

    res.json({
      message: "Content created successfully",
      content: {
        _id: newContent._id,
        title: newContent.title,
        link: newContent.link,
        description: newContent.description,
        tags: newContent.tags,
      },
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const MIN_SIMILARITY = 0.35;

const searchContent = async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query?.trim()) {
    return res.status(400).json({ error: "Query cannot be empty" });
  }

  try {
    const queryEmbedding = await generateEmbedding(query);
    // @ts-ignore
    const userId = req.userId;

    const scored = await retrieveRelevantContent(userId, queryEmbedding);

    const filtered = scored
      .filter((s) => s.similarity >= MIN_SIMILARITY)
      .slice(0, 5);

    res.json({
      message: "Search results",
      results: filtered.map((s) => ({
        _id: s.content._id,
        title: s.content.title,
        description: s.content.description,
        link: s.content.link,
        tags: s.content.tags,
        similarity: s.similarity,
      })),
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const MIN_RELEVANCE = 0.25;
const userChats: Record<string, { role: "user" | "assistant"; content: string }[]> = {};

const askEcho = async (req: Request, res: Response) => {
  const { query } = req.body;
  // @ts-ignore
  const userId = req.userId;

  if (!query?.trim()) {
    return res.status(400).json({ error: "Query cannot be empty" });
  }

  try {
    if (!userChats[userId]) userChats[userId] = [];

    userChats[userId].push({
      role: "user",
      content: query,
    });

    const chatHistory = userChats[userId]
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const queryEmbedding = await generateEmbedding(query);
    const scored = await retrieveRelevantContent(userId, queryEmbedding);

    let ragContext = "";
    let sources: any[] = [];

    if (scored.length && scored[0].similarity >= MIN_RELEVANCE) {
      const topNotes = scored.slice(0, 3);
      ragContext = topNotes
        .map(s => `Title: ${s.content.title}\nDescription: ${s.content.description}`)
        .join("\n\n---\n\n");

      sources = topNotes.map(s => ({
        id: s.content._id,
        title: s.content.title,
        similarity: s.similarity,
      }));
    }

    const finalPrompt = `
Conversation so far:
${chatHistory}

User’s new message:
${query}

Respond naturally, continuing the conversation.
    `;

    const messages = [
      { role: "user", content: finalPrompt }
    ];

    const answer = await askGroq(messages, ragContext);

    userChats[userId].push({
      role: "assistant",
      content: answer,
    });

    return res.json({
      answer,
      sources,
      history: userChats[userId],
    });

  } catch (error) {
    console.error("Ask error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const getContent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const contents = await Content.find({ userId });

    res.json({
      message: "Contents retrieved successfully",
      contents: contents.map((c) => ({
        _id: c._id,
        title: c.title,
        link: c.link,
        description: c.description,
        tags: c.tags,
      })),
    });
  } catch (error) {
    console.error("Get content error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteContent = async (req: Request, res: Response) => {
  const { contentId } = req.body;

  try {
    // @ts-ignore
    const userId = req.userId;

    await Content.findOneAndDelete({
      _id: contentId,
      userId,
    });

    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  createContent,
  searchContent,
  askEcho,
  getContent,
  deleteContent,
};
