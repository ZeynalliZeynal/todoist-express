// Core and third-party modules
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Constants
import {
  client_dev_origin,
  client_prod_origin,
  node_env,
} from "./constants/env";
import ResponseStatues from "./constants/response-statues";

// Controllers and middleware
import { authorizeTo } from "./controller/auth.controller";
import { authenticate } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/error-handler";
import { getUserAgent } from "./middleware/user-agent.middleware";

// Models
// Routers
import authRouter from "./router/auth.router";
import memberRouter from "./router/member.router";
import notificationRouter from "./router/notification.router";
import notificationSettingsRouter from "./router/notification-settings.router";
import notificationTypeRouter from "./router/notification-type.router";
import planRouter from "./router/plan.router";
import profileRouter from "./router/profile.router";
import projectRouter from "./router/project.router";
import sessionRouter from "./router/session.router";
import storageRouter from "./router/storage.router";
import taskRouter from "./router/task.router";
import taskTagRouter from "./router/task-tag.router";
import templateCategoriesRouter from "./router/template-categories.router";
import templateRouter from "./router/template.router";
import userRouter from "./router/user.router";

// Utilities
import AppError from "./utils/app-error";
import catchErrors from "./utils/catch-errors";
import { StatusCodes } from "http-status-codes";
import projectMemberRouter from "./router/project-member.router";

const API_PREFIX = "/api/v1/";

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

// app.use(getUserAgent);

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Available routes are given below.",
    data: {
      routes: [
        {
          ping: API_PREFIX + "ping",
        },
      ],
    },
  });
});

app.use(API_PREFIX + "tasks", taskRouter);
app.use(API_PREFIX + "task-tags", taskTagRouter);
app.use(API_PREFIX + "projects", projectRouter);
app.use(API_PREFIX + "templates", templateRouter);
app.use(API_PREFIX + "template-categories", templateCategoriesRouter);
app.use(API_PREFIX + "auth", authRouter);
app.use(API_PREFIX + "users", userRouter);
app.use(API_PREFIX + "profile", profileRouter);
app.use(API_PREFIX + "profile/sessions", sessionRouter);
app.use(API_PREFIX + "plans", planRouter);
app.use(API_PREFIX + "storage", storageRouter);
app.use(API_PREFIX + "notifications", notificationRouter);
app.use(API_PREFIX + "notification-types", notificationTypeRouter);
app.use(API_PREFIX + "notification-settings", notificationSettingsRouter);
app.use(API_PREFIX + "members", memberRouter);
app.use(API_PREFIX + "project-members", projectMemberRouter);

app.post(
  API_PREFIX + "update",
  authenticate,
  authorizeTo(["admin"]),
  catchErrors(async (req, res, next) => {
    // const users = await UserModel.find();
    // users.forEach(async (user) => {
    //   await MemberModel.create({
    //     user: user._id,
    //   });
    // });

    res.status(StatusCodes.OK).json({
      status: ResponseStatues.SUCCESS,
      message: "No update found",
    });
  }),
);

app.use(
  API_PREFIX + "ping",
  getUserAgent,
  async (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "API is up and running.",
      data: {
        location: req.location,
        userAgent: req.userAgent,
      },
    });
  },
);

app.all("*", (req: Request, res: Response, next: NextFunction) =>
  next(new AppError(`${req.originalUrl} not found`, StatusCodes.NOT_FOUND)),
);

app.use(errorHandler);

export default app;
