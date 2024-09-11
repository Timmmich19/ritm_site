import TelegramBot from "node-telegram-bot-api";
import { token } from "./config";
import { handleButtonPress } from "./handlers/handleMenuButtons";
import { createMenu } from "./utils/buttonMenu";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

if (!token) {
  throw new Error("BOT_TOKEN undefined");
}

const bot = new TelegramBot(token, { polling: true });
const tempDir = path.join(__dirname, "temp"); // Временная директория для хранения загруженных файлов
let processedImages: ProcessedImage[] = []; // Объявляем переменную на уровне модуля

console.log("Bot is running");

// Создаем временную директорию, если она не существует
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Выберите опцию:", createMenu());
});

bot.on("callback_query", handleButtonPress(bot));

interface ProcessedImage {
  filename: string;
  url: string;
}

// Обработка загрузки фотографий
bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  processedImages = []; // Сбрасываем массив при каждом новом запросе

  if (!msg.photo || !Array.isArray(msg.photo)) {
    return bot.sendMessage(chatId, "Не удалось получить фотографии.");
  }

  for (const photo of msg.photo) {
    const fileId = photo.file_id;

    try {
      const file = await bot.getFile(fileId);
      const filePath = file.file_path;

      if (!filePath) {
        console.error("File path is undefined");
        return bot.sendMessage(chatId, "Не удалось получить путь к файлу.");
      }

      const localFilePath = `https://api.telegram.org/file/bot${token}/${filePath}`;
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

      // Проверяем наличие ошибок в ответе сервера
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

  if (processedImages.length > 0) {
    processedImages.forEach((image: ProcessedImage) => {
      bot.sendPhoto(chatId, image.url);
    });

    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "ДА", callback_data: "confirm_yes" },
            { text: "НЕТ", callback_data: "confirm_no" },
          ],
        ],
      },
    };

    bot.sendMessage(chatId, "Загрузить эти обработанные изображения на сервер?", options);
  } else {
    bot.sendMessage(chatId, "Не удалось обработать изображения.");
  }
});

// Обработка нажатий на кнопки подтверждения
bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message?.chat.id; // Используем опциональную цепочку

  if (!callbackQuery.message || chatId === undefined) {
    console.error("Сообщение или chatId не найдены.");
    return;
  }

  const action = callbackQuery.data;

  if (action === "confirm_yes") {
    // Логика для загрузки изображений на сервер
    const uploadFormData = new FormData();
    processedImages.forEach((image) => {
      uploadFormData.append("images", fs.createReadStream(image.url)); // Здесь нужно будет изменить на локальный путь, если требуется
    });

    try {
      const uploadResponse = await axios.post("http://localhost:8080/api/upload-images", uploadFormData, {
        headers: {
          ...uploadFormData.getHeaders(),
        },
      });

      bot.sendMessage(chatId, "Изображения успешно загружены на сервер.");
    } catch (error) {
      console.error("Ошибка при загрузке изображений на сервер:", error);
      bot.sendMessage(chatId, "Произошла ошибка при загрузке изображений на сервер.");
    }
  } else if (action === "confirm_no") {
    bot.sendMessage(chatId, "Загрузка изображений отменена.");
  }

  // Удаляем сообщение с кнопками
  await bot.deleteMessage(chatId, callbackQuery.message.message_id);
});

// Обработка ошибок
bot.on("error", (error) => {
  console.error("Ошибка бота:", error);
});
