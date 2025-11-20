import express from "express";
import connectDb from "./config/db";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import contentRoutes from "./routes/content.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
connectDb();

app.get("/getContent", (req, res) => {
    res.send("Get Content Route");
});

app.use("/api/v1/", authRoutes);
app.use("/api/v1/", contentRoutes);

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
