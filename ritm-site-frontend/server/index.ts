import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World from Express with TypeScript!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
