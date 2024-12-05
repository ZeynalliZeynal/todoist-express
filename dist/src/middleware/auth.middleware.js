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
exports.authenticate = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const http_status_codes_1 = require("http-status-codes");
const jwt_1 = require("../utils/jwt");
const user_model_1 = __importDefault(require("../model/user.model"));
const session_model_1 = __importDefault(require("../model/session.model"));
exports.authenticate = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accessToken;
    if (!accessToken)
        return next(new app_error_1.default("You must log in to perform this action", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    const { payload, error } = (0, jwt_1.verifyToken)(accessToken);
    if (error || !payload)
        throw new app_error_1.default("Invalid or expired token. Try to log in again.", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    const currentSession = yield session_model_1.default.findById(payload.sessionId);
    const currentUser = yield user_model_1.default.findById(payload.userId).select("+role -__v");
    if (!currentUser)
        return next(new app_error_1.default("Token is no longer belong to this user. Please log in again", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    if (!currentSession)
        return next(new app_error_1.default("You are not logged in.", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    if (!currentUser.isVerified())
        return next(new app_error_1.default("Please verify your email", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    if (currentUser.isPasswordChangedAfter(payload.iat))
        return next(new app_error_1.default("Password recently changed. Please log in again", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    req.userId = payload.userId;
    req.sessionId = payload.sessionId;
    next();
}));
