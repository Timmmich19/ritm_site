import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const tempDir = path.join(__dirname, "../temp");

export interface ProcessedImage {
  filename: string;
  url: string;
}

export const processImages = async (bot: any, chatId: number, photos: any[]) => {
  let processedImages: ProcessedImage[] = [];

  for (const photo of photos) {
    const fileId = photo.file_id;

    try {
      const file = await bot.getFile(fileId);
      const filePath = file.file_path;

      if (!filePath) {
        console.error("File path is undefined");
        return bot.sendMessage(chatId, "Не удалось получить путь к файлу.");
      }

      const localFilePath = `https://api.telegram.org/file/bot${bot.token}/${filePath}`;
      const response = await axios.get(localFilePath, { responseType: "arraybuffer" });
      const tempFilePath = path.join(tempDir, fileId + ".jpg");
      fs.writeFileSync(tempFilePath, response.data);

      const formData = new FormData();
      formData.append("images", fs.createReadStream(tempFilePath));

      const serverResponse = await axios.post("http://localhost:8080/api/format-image", formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      if (serverResponse.data.error) {
        console.error("Ошибка сервера:", serverResponse.data.error);
        return bot.sendMessage(chatId, "Произошла ошибка при обработке изображений на сервере.");
      }

      const processedImagesBatch: ProcessedImage[] = serverResponse.data.processedImages;
      processedImages = processedImages.concat(processedImagesBatch);
    } catch (error) {
      console.error("Ошибка при обработке фотографии:", error);
      bot.sendMessage(chatId, "Произошла ошибка при обработке фотографии.");
    }
  }

  return processedImages;
};
