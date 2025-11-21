import { Router } from "express";
import {createContent, getContent, deleteContent, searchContent, askEcho} from "../controllers/content.controller.js";
import { userMiddleware } from "../middleware/middleware.js";

const router = Router();

router.post("/content/create", userMiddleware, createContent);
router.get("/content/get", userMiddleware, getContent);
router.delete("/content/delete", userMiddleware, deleteContent);
router.post("/search", userMiddleware, searchContent);
router.post("/ask", userMiddleware, askEcho);

export default router;