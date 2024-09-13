import multer from "multer";

const storage = multer.memoryStorage(); // Используйте память для хранения файлов
export const upload = multer({ storage: storage });
