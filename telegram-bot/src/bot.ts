import TelegramBot from "node-telegram-bot-api";

import dotenv from "dotenv";

dotenv.config();

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN не задан");
}

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  if (msg.text) {
    bot.sendMessage(msg.chat.id, `Вы написали: ${msg.text}`);
  }
});

bot.on("error", (error) => {
  console.error("Ошибка бота:", error);
});
