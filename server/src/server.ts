import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDb from "./config/db";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import contentRoutes from "./routes/content.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
connectDb();

app.use("/api/v1/", authRoutes);
app.use("/api/v1/", contentRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
