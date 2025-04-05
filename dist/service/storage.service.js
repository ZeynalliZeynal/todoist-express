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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileService = exports.uploadFileService = void 0;
const generate_name_1 = require("../utils/generate-name");
const client_s3_1 = require("@aws-sdk/client-s3");
const env_1 = require("../constants/env");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3 = new client_s3_1.S3Client({
    credentials: {
        accessKeyId: env_1.s3_access_key,
        secretAccessKey: env_1.s3_secret_key,
    },
    region: env_1.s3_bucket_region,
});
const uploadFileService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ buffer, contentType, existingFilename, prefix, }) {
    if (existingFilename) {
        yield (0, exports.deleteFileService)({
            prefix,
            filename: existingFilename,
        });
    }
    const filename = (0, generate_name_1.generateName)();
    const putCommand = new client_s3_1.PutObjectCommand({
        Bucket: env_1.s3_bucket_name,
        Key: `${prefix}/${filename}`,
        Body: buffer,
        ContentType: contentType,
    });
    const getCommand = new client_s3_1.GetObjectCommand({
        Bucket: env_1.s3_bucket_name,
        Key: `${prefix}/${filename}`,
    });
    const fileUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, getCommand);
    yield s3.send(putCommand);
    return fileUrl;
});
exports.uploadFileService = uploadFileService;
const deleteFileService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ filename, prefix, }) {
    const deleteCommand = new client_s3_1.DeleteObjectCommand({
        Bucket: env_1.s3_bucket_name,
        Key: `${prefix}/${filename}`,
    });
    yield s3.send(deleteCommand);
});
exports.deleteFileService = deleteFileService;
