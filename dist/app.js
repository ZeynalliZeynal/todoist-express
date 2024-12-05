"use strict";
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
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, hpp_1.default)());
app.use((0, morgan_1.default)("dev"));
const limiter = (0, express_rate_limit_1.default)({
    limit: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP. Please try again in an hour!",
});
app.use("/api", limiter);
app.use(express_1.default.json({
    limit: "10mb",
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: env_1.client_dev_origin,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use("/api/v1/tasks", task_router_1.default);
app.use("/api/v1/templates", template_router_1.default);
app.use("/api/v1/auth", auth_router_1.default);
app.use("/api/v1/users", user_router_1.default);
app.use("/api/v1/profile", profile_router_1.default);
app.use("/api/v1/profile/sessions", session_router_1.default);
app.all("*", (req, res, next) => next(new app_error_1.default(`${req.originalUrl} not found`, http_status_codes_1.StatusCodes.NOT_FOUND)));
app.use(error_handler_1.errorHandler);
exports.default = app;
