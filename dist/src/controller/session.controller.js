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
exports.deleteSession = exports.getSessions = void 0;
const session_model_1 = __importDefault(require("../model/session.model"));
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const app_error_1 = __importDefault(require("../utils/app-error"));
exports.getSessions = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const sessions = yield session_model_1.default.find({
        userId: req.userId,
        expiresAt: { $gte: new Date() },
    }, {
        _id: 1,
        userAgent: 1,
        createdAt: 1,
    }, { sort: { createdAt: -1 } });
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        data: sessions.map((session) => (Object.assign(Object.assign({}, session.toObject()), (session.id === req.sessionId && {
            current: true,
        })))),
    });
}));
exports.deleteSession = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = zod_1.z.string().parse(req.params.id);
    const session = yield session_model_1.default.deleteOne({
        _id: sessionId,
        userId: req.userId,
    });
    if (!session)
        return next(new app_error_1.default("No session found.", http_status_codes_1.StatusCodes.NOT_FOUND));
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        message: "Session successfully deleted.",
    });
}));
