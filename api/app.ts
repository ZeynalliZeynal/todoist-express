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
import {
  client_dev_origin,
  client_prod_origin,
  node_env,
} from "./constants/env";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import profileRouter from "./router/profile.router";
import sessionRouter from "./router/session.router";
import planRouter from "./router/plan.router";
import templateCategoriesRouter from "./router/template-categories.router";
import projectRouter from "./router/project.router";
import storageRouter from "./router/storage.router";
import taskTagRouter from "./router/task-tag.router";
import { getUserAgent } from "./middleware/user-agent.middleware";

const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(morgan("dev"));

app.set("trust proxy", ["loopback", "127.0.0.1", "::1"]);

const limiter = rateLimit({
  limit: 100,
  windowMs: 15 * 60 * 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP. Please try again in an hour!",
});

if (node_env === "production") app.use("/api/auth", limiter);

app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:
      node_env === "development"
        ? client_dev_origin
        : node_env === "production"
          ? client_prod_origin
          : "*",
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(getUserAgent);

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Available routes are given below.",
    data: {
      routes: [
        {
          ping: "/api/v1/ping",
        },
      ],
    },
  });
});

app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/task-tags", taskTagRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/templates", templateRouter);
app.use("/api/v1/template-categories", templateCategoriesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/profile/sessions", sessionRouter);
app.use("/api/v1/plans", planRouter);
app.use("/api/v1/storage", storageRouter);

app.use("/api/v1/ping", async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "API is up and running.",
    data: {
      location: req.location,
      userAgent: req.userAgent,
    },
  });
});

app.all("*", (req: Request, res: Response, next: NextFunction) =>
  next(new AppError(`${req.originalUrl} not found`, StatusCodes.NOT_FOUND)),
);

app.use(errorHandler);

export default app;
