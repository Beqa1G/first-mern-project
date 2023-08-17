import express, { NextFunction, Request, Response } from "express";
import logger from "./utils/logger";
import "dotenv/config";
import connect from "./utils/connect";
import env from "./utils/validatedotenv";
/* import handleErrors from "./middleware/error"; */
/* import checkEndpoint from "./middleware/checkEndpoint"; */
import linksRoutes from "./routes/links.routes";
import userRoutes from "./routes/users.routes"
import faviconRoute from "./routes/favicon.routes";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors"
import createHttpError, { isHttpError } from "http-errors";
import { protectMiddleWare } from "./middleware/authMiddleware";



const app = express();
const port = env.PORT;

app.use(morgan("dev"));

app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], 
}))

app.use(cookieParser());

app.use("/api/users", userRoutes)

app.use("/api/links", protectMiddleWare, linksRoutes);

app.use("/favicon.ico", faviconRoute);

app.use((req, res, next) => {
  next(createHttpError(404, "endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  logger.error(error);
  let errorMessage = "unknown error";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status
    errorMessage = error.message
  } 
  res.status(statusCode).json({ error: errorMessage });
});


app.listen(port, async () => {
  logger.info(`app is running at http://localhost:${port}`);

  await connect();
});
