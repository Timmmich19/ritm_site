import TelegramBot from "node-telegram-bot-api";

const token = "7037460781:AAFIfcRf5_EmkyqCAy1DK9Xqf2BwWl8N_Xg";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  if (msg.text) {
    bot.sendMessage(msg.chat.id, `Вы написали: ${msg.text}`);
  }
});

bot.on("error", (error) => {
  console.error("Ошибка бота:", error);
});
