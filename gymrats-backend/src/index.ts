import express, { Express, Request, Response, Application } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import testRoute from "./routes/test.route";
import userRoute from "./routes/user.route";
import announcementRoute from "./routes/announcement.route";
import addressRoute from "./routes/address.route";
import programRoute from "./routes/program.route";
import { authenticateController } from "./controllers/authenticate.controller";
import bodyParser from "body-parser";

const upload = multer();
//For env File
dotenv.config();

const app: Application = express();
app.use(express.urlencoded({ extended: true, limit: 4000000 }));
app.use(express.json({ limit: 4000000 }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:4200", "http://83.212.75.182:4242"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// app.use(upload.array())
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//     limit: 4000000,
//     parameterLimit: 50000,
//   })
// );
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
// app.use("/program", programRoute);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
