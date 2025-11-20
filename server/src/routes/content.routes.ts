import { Router } from "express";
import {createContent, getContent, deleteContent} from "../controllers/content.controller.js";
import { userMiddleware } from "../middleware/middleware.js";

const router = Router();

router.post("/create", userMiddleware, createContent);
router.get("/content", userMiddleware, getContent);
router.delete("/delete", userMiddleware, deleteContent);

export default router;