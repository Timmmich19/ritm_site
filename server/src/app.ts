import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import imageRoutes from "./routes/imageRoutes";

dotenv.config({ path: "./.env" });

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/processed", express.static(path.join(__dirname, "..", "processed_images")));

// Используем маршруты
app.use(imageRoutes);

app.get("/", (_, res) => {
  res.send("HI Express + TypeScript");
});

export default app;
