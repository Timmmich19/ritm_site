import { Bot } from "grammy";
import dotenv from "dotenv";

dotenv.config();

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!); // Ensure you have a BOT_TOKEN in your .env file

bot.command("start", (ctx) => ctx.reply("Welcome!"));

bot.start();
