import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;

import express from "express";
import connectDb from "./config/db";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import contentRoutes from "./routes/content.routes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://brainbucket-zeta.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
connectDb();

app.use("/api/v1/", authRoutes);
app.use("/api/v1/", contentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
