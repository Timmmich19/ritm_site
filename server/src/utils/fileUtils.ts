import fs from "fs";
import path from "path";

const uploadDir = path.join(__dirname, "..", "..", "uploads");
const processedDir = path.join(__dirname, "..", "..", "processed_images");

// Создаем директорию processed_images при ее отсутствии
if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}

export const getNextFileNumber = (dir: string): number => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const files = fs.readdirSync(dir);
  const photoFiles = files.filter((file) => file.startsWith("processed_photo") && file.endsWith(".png"));
  const numbers = photoFiles.map((file) => {
    const match = file.match(/processed_photo(\d+)\.png/);
    return match ? parseInt(match[1], 10) : 0;
  });

  return numbers.length > 0 ? Math.max(...numbers) + 1 : 1; // Start from 1 if no files exist
};
