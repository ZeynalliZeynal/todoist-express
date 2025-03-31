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
exports.getMembership = exports.getMemberships = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const membership_model_1 = __importDefault(require("../model/membership.model"));
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const app_error_1 = __importDefault(require("../utils/app-error"));
exports.getMemberships = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const memberships = yield membership_model_1.default.find();
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Memberships fetched successfully",
        data: {
            memberships,
        },
    });
}));
exports.getMembership = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validId = zod_1.z.string().parse(req.params.id);
    const membership = yield membership_model_1.default.findById(validId);
    if (!membership)
        return next(new app_error_1.default("There is no membership with this id", http_status_codes_1.StatusCodes.NOT_FOUND));
}));
