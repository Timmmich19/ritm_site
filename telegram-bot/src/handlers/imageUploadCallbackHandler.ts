import axios from "axios";
import fs from "fs";
import path from "path";

const tempDir = path.join(__dirname, "../temp");

const handleCallbackQuery = async (bot: any, callbackQuery: any) => {
  const chatId = callbackQuery.message?.chat.id;

  if (!callbackQuery.message || chatId === undefined) {
    console.error("Сообщение или chatId не найдены.");
    return;
  }

  const action = callbackQuery.data;

  if (action === "confirm_yes") {
    try {
      const uploadResponse = await axios.post("http://localhost:8080/api/save-formated-images");
      bot.sendMessage(chatId, "Изображения успешно загружены на сервер.");
      console.log(uploadResponse);
    } catch (error) {
      console.error("Ошибка при загрузке изображений на сервер:", error);
      bot.sendMessage(chatId, "Произошла ошибка при загрузке изображений на сервер.");
    }
  } else if (action === "confirm_no") {
    bot.sendMessage(chatId, "Загрузка изображений отменена. Изображения будут удалены через минуту.");
  }

  // Запускаем таймер для удаления изображений через минуту
  setTimeout(() => {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.error("Ошибка при чтении временной директории:", err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(tempDir, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Ошибка при удалении файла:", err);
          } else {
            console.log(`Удален файл: ${file}`);
          }
        });
      });
    });
  }, 60000); // 60000 миллисекунд = 1 минута

  // Удаляем сообщение с кнопками
  await bot.deleteMessage(chatId, callbackQuery.message.message_id);
};

export { handleCallbackQuery };
