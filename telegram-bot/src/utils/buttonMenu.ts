function createMenu() {
  return {
    reply_markup: {
      inline_keyboard: [[{ text: "Загрузить фотографии", callback_data: "upload_photos" }]],
    },
  };
}

export { createMenu };
