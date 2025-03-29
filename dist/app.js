"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const task_router_1 = __importDefault(require("./router/task.router"));
const template_router_1 = __importDefault(require("./router/template.router"));
const app_error_1 = __importDefault(require("./utils/app-error"));
const error_handler_1 = require("./middleware/error-handler");
const auth_router_1 = __importDefault(require("./router/auth.router"));
const user_router_1 = __importDefault(require("./router/user.router"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./constants/env");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_status_codes_1 = require("http-status-codes");
const profile_router_1 = __importDefault(require("./router/profile.router"));
const session_router_1 = __importDefault(require("./router/session.router"));
const plan_router_1 = __importDefault(require("./router/plan.router"));
const template_categories_router_1 = __importDefault(require("./router/template-categories.router"));
const project_router_1 = __importDefault(require("./router/project.router"));
const storage_router_1 = __importDefault(require("./router/storage.router"));
const task_tag_router_1 = __importDefault(require("./router/task-tag.router"));
const user_agent_middleware_1 = require("./middleware/user-agent.middleware");
const notification_router_1 = __importDefault(require("./router/notification.router"));
const notification_type_router_1 = __importDefault(require("./router/notification-type.router"));
const notification_settings_router_1 = __importDefault(require("./router/notification-settings.router"));
const API_PREFIX = "/api/v1/";
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, hpp_1.default)());
app.use((0, morgan_1.default)("dev"));
app.set("trust proxy", ["loopback", "127.0.0.1", "::1"]);
const limiter = (0, express_rate_limit_1.default)({
    limit: 100,
    windowMs: 15 * 60 * 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP. Please try again in an hour!",
});
if (env_1.node_env === "production")
    app.use("/api/auth", limiter);
app.use(express_1.default.json({
    limit: "10mb",
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: env_1.node_env === "development"
        ? env_1.client_dev_origin
        : env_1.node_env === "production"
            ? env_1.client_prod_origin
            : "*",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
// app.use(getUserAgent);
app.get("/", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({
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
app.use(API_PREFIX + "tasks", task_router_1.default);
app.use(API_PREFIX + "task-tags", task_tag_router_1.default);
app.use(API_PREFIX + "projects", project_router_1.default);
app.use(API_PREFIX + "templates", template_router_1.default);
app.use(API_PREFIX + "template-categories", template_categories_router_1.default);
app.use(API_PREFIX + "auth", auth_router_1.default);
app.use(API_PREFIX + "users", user_router_1.default);
app.use(API_PREFIX + "profile", profile_router_1.default);
app.use(API_PREFIX + "profile/sessions", session_router_1.default);
app.use(API_PREFIX + "plans", plan_router_1.default);
app.use(API_PREFIX + "storage", storage_router_1.default);
app.use(API_PREFIX + "notifications", notification_router_1.default);
app.use(API_PREFIX + "notification-types", notification_type_router_1.default);
app.use(API_PREFIX + "notification-settings", notification_settings_router_1.default);
app.use(API_PREFIX + "ping", user_agent_middleware_1.getUserAgent, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        message: "API is up and running.",
        data: {
            location: req.location,
            userAgent: req.userAgent,
        },
    });
}));
app.all("*", (req, res, next) => next(new app_error_1.default(`${req.originalUrl} not found`, http_status_codes_1.StatusCodes.NOT_FOUND)));
app.use(error_handler_1.errorHandler);
exports.default = app;
