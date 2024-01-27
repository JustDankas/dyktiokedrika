import express, { Express, Request, Response, Application } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import testRoute from "./routes/test.route";
import userRoute from "./routes/user.route";
import announcementRoute from "./routes/announcement.route";
import addressRoute from "./routes/address.route";
import programRoute from "./routes/program.route";
import { authenticateController } from "./controllers/authenticate.controller";
//For env File
dotenv.config();

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:4200", "http://83.212.75.182:4242"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server!!!!");
});

app.use("/test", testRoute);
app.use("/user", userRoute);
app.use("/announcement", authenticateController, announcementRoute);
app.use("/address", authenticateController, addressRoute);
app.use("/program", authenticateController, programRoute);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
