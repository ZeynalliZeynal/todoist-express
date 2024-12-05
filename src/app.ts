import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import taskRouter from "./router/task.router";
import templateRouter from "./router/template.router";
import AppError from "./utils/app-error";
import { errorHandler } from "./middleware/error-handler";
import authRouter from "./router/auth.router";
import userRouter from "./router/user.router";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cors from "cors";
import { client_dev_origin } from "./constants/env";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import profileRouter from "./router/profile.router";
import sessionRouter from "./router/session.router";

const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(morgan("dev"));

const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again in an hour!",
});

app.use("/api", limiter);

app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: client_dev_origin,
    credentials: true,
  }),
);

app.use(cookieParser());

app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/templates", templateRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/profile/sessions", sessionRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) =>
  next(new AppError(`${req.originalUrl} not found`, StatusCodes.NOT_FOUND)),
);

app.use(errorHandler);

export default app;
