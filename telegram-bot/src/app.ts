import TelegramBot from "node-telegram-bot-api";
import { token } from "./config";
import { handleButtonPress } from "./handlers/handleMainMenuButtons";
import { createMenu } from "./utils/buttonMenu";
import { ProcessedImage, processImages } from "./utils/imageProcessor";
import { handleCallbackQuery } from "./handlers/imageUploadCallbackHandler";
import fs from "fs";
import path from "path";

if (!token) {
  throw new Error("BOT_TOKEN undefined");
}

const bot = new TelegramBot(token, { polling: true });
const tempDir = path.join(__dirname, "temp");

console.log("Bot is running");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Выберите опцию:", createMenu());
});

bot.on("callback_query", (callbackQuery) => handleCallbackQuery(bot, callbackQuery));

bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;

  if (!msg.photo || !Array.isArray(msg.photo)) {
    return bot.sendMessage(chatId, "Не удалось получить фотографии.");
  }

  const processedImages: ProcessedImage[] = await processImages(bot, chatId, msg.photo);

  if (processedImages.length > 0) {
    processedImages.forEach((image) => {
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

// Обработка ошибок
bot.on("error", (error) => {
  console.error("Ошибка бота:", error);
});
