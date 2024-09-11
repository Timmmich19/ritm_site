import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { getNextFileNumber, moveProcessedImagesToUploads, clearProcessedImagesDirectory } from "../utils/fileUtils";

const uploadDir = path.join(__dirname, "..", "..", "uploads");
const processedDir = path.join(__dirname, "..", "..", "processed_images");

export const formatImage = async (req: Request, res: Response) => {
  if (!req.files || !Array.isArray(req.files)) {
    return res.status(400).send({ error: "No images uploaded." });
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
        const processedImage = await sharp(resizedImageBuffer).resize(targetWidth, targetHeight, { fit: "cover" }).png().toBuffer();

        // Создаем уникальное имя для обработанного изображения
        const nextFileNumber = getNextFileNumber(processedDir, "processed_photo"); // Ensure this is called with processedDir
        const filename = `processed_photo${nextFileNumber}.png`;
        const filePath = path.join(processedDir, filename);

        // Save the processed image temporarily in processed_images
        await fs.promises.writeFile(filePath, processedImage);
        const fileUrl = `http://localhost:${process.env.PORT}/processed/${filename}`;
        results.push({ filename, url: fileUrl });
      } catch (error) {
        console.error("Error processing image:", error);
        continue; // Skip this file if there's an error
      }
    }
  }

  if (results.length === 0) {
    return res.status(400).send({ error: "No images were processed successfully." });
  }

  clearProcessedImagesDirectory(processedDir, 60000); // 60000

  res.json({ processedImages: results });
};

export const uploadImages = async (req: Request, res: Response) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    return res.status(400).send({ error: "No images uploaded." });
  }

  const results: { filename: string; url: string }[] = [];

  for (const file of req.files) {
    if (!file.buffer) {
      console.warn("File buffer is missing, skipping this file.");
      continue; // Skip if the buffer is missing
    }

    try {
      const nextFileNumber = getNextFileNumber(uploadDir, "photo");
      const filename = `photo${nextFileNumber}.png`;
      const filePath = path.join(uploadDir, filename);

      await fs.promises.writeFile(filePath, file.buffer);
      const fileUrl = `http://localhost:${process.env.PORT}/uploads/${filename}`;
      results.push({ filename, url: fileUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      continue; // Skip this file if there's an error
    }
  }

  res.json(results);
};

export const moveProcessedImages = async (req: Request, res: Response) => {
  try {
    const result = await moveProcessedImagesToUploads(processedDir, uploadDir);
    res.json(result); // Возвращаем результат, который содержит сообщение
  } catch (error) {
    console.error("Error moving processed images:", error);
    res.status(500).send("Failed to move processed images.");
  }
};

export const getImages = (req: Request, res: Response) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const imageFiles = files.filter((file) => file.startsWith("photo") && file.endsWith(".png"));
    const imageUrls = imageFiles.map((file) => `http://localhost:${process.env.PORT}/uploads/${file}`);
    res.json(imageUrls);
  } catch (error) {
    console.error("Error reading directory:", error);
    res.status(500).send("Failed to retrieve images.");
  }
};
