import TelegramBot from "node-telegram-bot-api";

const handleButtonPress = (bot: TelegramBot) => (query: TelegramBot.CallbackQuery) => {
  const chatId = query.message?.chat?.id;
  const data = query.data;

  if (data && chatId) {
    switch (data) {
      case "upload_photos":
        bot.sendMessage(chatId, "Пожалуйста, загрузите ваши фотографии.");
        break;
      default:
        bot.sendMessage(chatId, "Неизвестная команда.");
    }
  }

  // Ответ на запрос, чтобы убрать "ожидание" у кнопки
  bot.answerCallbackQuery(query.id);
};

export { handleButtonPress };
