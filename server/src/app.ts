// src/app.ts или app.ts если в корне
import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";

dotenv.config({ path: "./.env" });

const app: Express = express();
const port = process.env.PORT || 8000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// Директория для сохранения изображений (на один уровень выше текущего)
const uploadDir = path.join(__dirname, "..", "uploads");

// Убедитесь, что директория существует
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Функция для определения следующего номера файла
const getNextFileNumber = (dir: string): number => {
  const files = fs.readdirSync(dir);
  const photoFiles = files.filter((file) => file.startsWith("photo") && file.endsWith(".jpg"));

  if (photoFiles.length === 0) {
    return 1;
  }

  const numbers = photoFiles.map((file) => {
    const match = file.match(/^photo(\d+)\.jpg$/);
    return match ? parseInt(match[1], 10) : 0;
  });

  return Math.max(...numbers) + 1;
};

// Обработка запроса /api/format-image
app.post("/api/format-image", upload.array("images"), async (req: Request, res: Response) => {
  if (!req.files || !Array.isArray(req.files)) {
    return res.status(400).send("No images uploaded.");
  }

  const results: { filename: string; url: string }[] = [];

  for (const file of req.files) {
    if (file && file.buffer) {
      try {
        const targetWidth = 400;
        const targetHeight = 600;
        const image = file.buffer;
        const metadata = await sharp(image).metadata();

        if (!metadata.width || !metadata.height) {
          continue; // Skip this file if metadata is invalid
        }

        const { width: originalWidth, height: originalHeight } = metadata;
        const targetRatio = targetWidth / targetHeight;
        const originalRatio = originalWidth / originalHeight;

        let resizeWidth, resizeHeight;

        if (originalRatio > targetRatio) {
          resizeWidth = Math.round(targetHeight * originalRatio);
          resizeHeight = targetHeight;
        } else {
          resizeWidth = targetWidth;
          resizeHeight = Math.round(targetWidth / originalRatio);
        }

        const resizedImageBuffer = await sharp(image).resize(resizeWidth, resizeHeight).toBuffer();

        const processedImage = await sharp(resizedImageBuffer).resize(targetWidth, targetHeight, { fit: "cover" }).toBuffer();

        const nextFileNumber = getNextFileNumber(uploadDir);
        const filename = `photo${nextFileNumber}.jpg`;
        const filePath = path.join(uploadDir, filename);

        await fs.promises.writeFile(filePath, processedImage);

        // Формируем URL для возвращения (или просто имя файла, если не используете URL)
        const fileUrl = `http://localhost:${port}/uploads/${filename}`;
        results.push({ filename, url: fileUrl });
      } catch (error) {
        console.error("Error processing image:", error);
        continue; // Skip this file if there's an error
      }
    }
  }

  res.json(results);
});

app.get("/api/images", (req: Request, res: Response) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const imageFiles = files.filter((file) => file.startsWith("photo") && file.endsWith(".jpg"));
    const imageUrls = imageFiles.map((file) => `http://localhost:${port}/uploads/${file}`);
    res.json(imageUrls);
  } catch (error) {
    console.error("Error reading directory:", error);
    res.status(500).send("Failed to retrieve images.");
  }
});

app.use("/uploads", express.static(uploadDir));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
