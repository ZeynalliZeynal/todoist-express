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
exports.uploadFile = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const client_s3_1 = require("@aws-sdk/client-s3");
const env_1 = require("../constants/env");
const http_status_codes_1 = require("http-status-codes");
const generate_name_1 = require("../utils/generate-name");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: env_1.s3_access_key,
        secretAccessKey: env_1.s3_secret_key,
    },
    region: env_1.s3_bucket_region,
});
exports.uploadFile = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const filename = req.file?.originalname.split(" ").join("_");
    var _a, _b;
    const filename = (0, generate_name_1.generateName)();
    const putCommand = new client_s3_1.PutObjectCommand({
        Bucket: env_1.s3_bucket_name,
        Key: `avatars/${filename}`,
        Body: (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer,
        ContentType: (_b = req.file) === null || _b === void 0 ? void 0 : _b.mimetype,
    });
    const getCommand = new client_s3_1.GetObjectCommand({
        Bucket: env_1.s3_bucket_name,
        Key: `avatars/${filename}`,
    });
    const fileUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, getCommand);
    yield s3.send(putCommand);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        status: "success",
        message: "File uploaded successfully",
        data: {
            fileUrl: fileUrl,
        },
    });
}));
