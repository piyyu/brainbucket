import { Router } from "express";
import {createContent, getContent, deleteContent, searchContent, askEcho} from "../controllers/content.controller.js";
import { userMiddleware } from "../middleware/middleware.js";

const router = Router();

router.post("/bucket/create", userMiddleware, createContent);
router.get("/bucket/get", userMiddleware, getContent);
router.delete("/bucket/delete", userMiddleware, deleteContent);
router.post("/search", userMiddleware, searchContent);
router.post("/ask", userMiddleware, askEcho);

export default router;