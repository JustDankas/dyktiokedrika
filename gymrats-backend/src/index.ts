import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";

import testRoute from "./routes/test.route";
//For env File
dotenv.config();

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server!!!!");
});

app.use("/test", testRoute);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
