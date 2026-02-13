import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    const header = req.headers["auth"];

    const decodedToken = token || header;

    if (!decodedToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = await jwt.verify(decodedToken as string, process.env.JWT_SECRET as string);
        //@ts-ignore
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};