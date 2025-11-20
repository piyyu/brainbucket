import { Request, Response } from "express";
import content from "../models/content.model";

const createContent = async (req: Request, res: Response) => {
    const { title, link, description } = req.body;

    try {
        const newContent = new content({
            title,
            link,
            description,
            // @ts-ignore
            userId: req.userId,
            tags: []
        });

        await newContent.save();

        res.json({
            message: "Content created successfully",
            content: newContent
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const getContent = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const contents = await content.find({ userId: userId }).populate("userId", "username");
        res.json({
            contents: contents,
            message: "Contents retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const deleteContent = async (req: Request, res: Response) => {
    const contentId = req.body.contentId;

    try {
        //@ts-ignore
        const userId = req.userId;
        await content.findByIdAndDelete({ _id: contentId, userId: userId });
        res.json({ message: "Content deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export { createContent, getContent, deleteContent };