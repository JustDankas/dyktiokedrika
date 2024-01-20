import express, { Express, Request, Response, Application } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import testRoute from "./routes/test.route";
import userRoute from "./routes/user.route";
import announcementRoute from "./routes/announcement.route";
//For env File
dotenv.config();

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server!!!!");
});

app.use("/test", testRoute);
app.use("/user", userRoute);
app.use("/announcement", announcementRoute);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
