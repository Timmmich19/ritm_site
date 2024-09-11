import fs from "fs";
import path from "path";

const uploadDir = path.join(__dirname, "..", "..", "uploads");
const processedDir = path.join(__dirname, "..", "..", "processed_images");

// Создаем директорию processed_images при ее отсутствии
if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}

export const getNextFileNumber = (dir: string, prefix: string): number => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const files = fs.readdirSync(dir);
  // Используем переданный префикс для фильтрации файлов
  const photoFiles = files.filter((file) => file.startsWith(prefix) && file.endsWith(".png"));
  const numbers = photoFiles.map((file) => {
    const match = file.match(new RegExp(`${prefix}(\\d+)\\.png`)); // Используем динамическое регулярное выражение
    return match ? parseInt(match[1], 10) : 0;
  });

  return numbers.length > 0 ? Math.max(...numbers) + 1 : 1; // Начинаем с 1, если нет файлов
};

export const moveProcessedImagesToUploads = async (processedDir: string, uploadDir: string) => {
  const processedFiles = fs.readdirSync(processedDir);

  if (processedFiles.length === 0) {
    return { message: "No images to save." }; // Возвращаем сообщение, если нет файлов
  }

  const savedImages = []; // Массив для хранения информации о сохраненных изображениях

  for (const file of processedFiles) {
    const sourcePath = path.join(processedDir, file);
    const stats = fs.statSync(sourcePath);
    if (!stats.isFile()) {
      console.warn(`${sourcePath} is not a file, skipping.`);
      continue;
    }

    const nextFileNumber = getNextFileNumber(uploadDir, "photo"); // Указываем префикс 'photo'
    const newFilename = `photo${nextFileNumber}.png`; // Генерация уникального имени
    const destPath = path.join(uploadDir, newFilename);

    await fs.promises.rename(sourcePath, destPath); // Перемещение файла
    savedImages.push(newFilename); // Добавляем имя сохраненного файла в массив
  }

  if (savedImages.length > 0) {
    return { message: "Images saved successfully" }; // Возвращаем сообщение об успешном сохранении
  }

  return { message: "No images were saved." }; // Если не было сохранено ни одного изображения
};

export const clearProcessedImagesDirectory = (processedDir: string, waitTime: number) => {
  setTimeout(() => {
    fs.readdir(processedDir, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(processedDir, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log(`Deleted file: ${file}`);
          }
        });
      });
    });
  }, waitTime);
};
