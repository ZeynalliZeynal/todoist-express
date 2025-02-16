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
exports.getUser = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const user_model_1 = __importDefault(require("../model/user.model"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const http_status_codes_1 = require("http-status-codes");
const date_fns_1 = require("date-fns");
exports.getUser = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query = user_model_1.default.findById(req.userId);
    if (req.query.tasks && req.query.tasks === "enable")
        query = query.populate("tasks");
    if (req.query.plan && req.query.plan === "enable")
        query = query.populate("plan");
    const user = yield query;
    if (!user)
        return next(new app_error_1.default("No user found. You may not be logged in.", http_status_codes_1.StatusCodes.NOT_FOUND));
    return res
        .cookie("test", "test", {
        expires: (0, date_fns_1.addDays)(Date.now(), 30),
        secure: false,
        httpOnly: true,
        sameSite: "lax",
    })
        .status(http_status_codes_1.StatusCodes.OK)
        .json({
        status: "success",
        data: {
            user,
        },
    });
}));
