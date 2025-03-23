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
exports.deleteFile = exports.uploadFile = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const http_status_codes_1 = require("http-status-codes");
const file_service_1 = require("../service/file.service");
const user_model_1 = __importDefault(require("../model/user.model"));
const app_error_1 = __importDefault(require("../utils/app-error"));
exports.uploadFile = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const user = yield user_model_1.default.findById(req.userId);
    if (!user)
        return next(new app_error_1.default("User does not exist", http_status_codes_1.StatusCodes.NOT_FOUND));
    const fileUrl = yield (0, file_service_1.uploadFileService)({
        buffer: (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer,
        contentType: (_b = req.file) === null || _b === void 0 ? void 0 : _b.mimetype,
        existingFilename: !user.avatar.includes("avatar.vercel.sh")
            ? (_c = user.avatar.split("/").at(-1)) === null || _c === void 0 ? void 0 : _c.split("?").at(0)
            : undefined,
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        status: "success",
        message: "File uploaded successfully",
        data: {
            fileUrl: fileUrl,
        },
    });
}));
exports.deleteFile = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const filename = req.file?.originalname.split(" ").join("_");
    yield (0, file_service_1.deleteFileService)({ filename: req.params.filename });
    res.status(http_status_codes_1.StatusCodes.NO_CONTENT).json({
        status: "success",
        message: "File deleted successfully",
    });
}));
