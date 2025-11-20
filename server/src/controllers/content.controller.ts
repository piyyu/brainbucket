import { Request, Response } from "express";
import Content from "../models/content.model";
import { generateEmbedding } from "../utils/embedding.js";

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
      tags: []
    });

    res.json({
      message: "Content created successfully",
      content: {
        _id: newContent._id,
        title: newContent.title,
        link: newContent.link,
        description: newContent.description,
        tags: newContent.tags
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const MIN_SIMILARITY = 0.55; // adjust based on testing

const searchContent = async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query?.trim()) {
    return res.status(400).json({ error: "Query cannot be empty" });
  }

  try {
    const queryEmbedding = await generateEmbedding(query);

    // @ts-ignore
    const userId = req.userId;
    const allContents = await Content.find({ userId });

    const validContents = allContents.filter(
      (c) => Array.isArray(c.embedding) && c.embedding.length > 0
    );

    const scored = validContents.map((c) => ({
      item: {
        _id: c._id,
        title: c.title,
        description: c.description,
        link: c.link,
        tags: c.tags,
      },
      similarity: cosineSimilarity(queryEmbedding, c.embedding as number[]),
    }));

    const filtered = scored
      .sort((a, b) => b.similarity - a.similarity)
      .filter((s) => s.similarity >= MIN_SIMILARITY)
      .slice(0, 5);

    res.json({
      message: "Search results",
      results: filtered,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getContent = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const contents = await Content.find({ userId });

    res.json({
      message: "Contents retrieved successfully",
      contents: contents.map(c => ({
        _id: c._id,
        title: c.title,
        link: c.link,
        description: c.description,
        tags: c.tags
      }))
    });

  } catch (error) {
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
      userId
    });

    res.json({ message: "Content deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createContent, getContent, deleteContent, searchContent };
