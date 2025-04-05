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
exports.sendFeedback = exports.getFeedbacks = void 0;
const http_status_codes_1 = require("http-status-codes");
const feedback_model_1 = __importDefault(require("../model/feedback.model"));
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const zod_1 = require("zod");
const email_1 = require("../utils/email");
const user_model_1 = __importDefault(require("../model/user.model"));
const env_1 = require("../constants/env");
exports.getFeedbacks = (0, catch_errors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbacks = yield feedback_model_1.default.find({ user: req.userId })
        .populate("user")
        .select("-createdAt");
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        data: {
            feedbacks,
        },
    });
}));
exports.sendFeedback = (0, catch_errors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validData = zod_1.z
        .object({
        content: zod_1.z
            .string()
            .min(10, "Feedback content must be at least 10 characters"),
        rating: zod_1.z.number().min(1).max(5, "Rating must be between 1 and 5"),
        page: zod_1.z.string().optional(),
    })
        .parse(req.body);
    yield feedback_model_1.default.create(Object.assign(Object.assign({}, validData), { user: req.userId }));
    const user = yield user_model_1.default.findById(req.userId).select("name email");
    yield (0, email_1.sendMail)({
        to: [env_1.admin_email],
        subject: "New feedback",
        text: `New feedback from ${user === null || user === void 0 ? void 0 : user.name}, ${user === null || user === void 0 ? void 0 : user.email}. Rating: ${validData.rating}.`,
        html: validData.content,
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        status: "success",
        message: "Your feedback has been sent.",
    });
}));
