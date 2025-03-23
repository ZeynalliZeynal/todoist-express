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
exports.checkBucketPrefix = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const http_status_codes_1 = require("http-status-codes");
const bucket_prefixes_1 = require("../constants/bucket-prefixes");
exports.checkBucketPrefix = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // check if prefix exists
    if (!req.params.prefix)
        return next(new app_error_1.default("Prefix is required.", http_status_codes_1.StatusCodes.BAD_REQUEST));
    // check bucket prefix
    if (!(0, bucket_prefixes_1.isValidBucketPrefix)(req.params.prefix))
        return next(new app_error_1.default(`Please specify a valid prefix that exists in the storage. One of "${Object.values(bucket_prefixes_1.BUCKET_PREFIXES).join(", ")}".`, http_status_codes_1.StatusCodes.BAD_REQUEST));
    next();
}));
