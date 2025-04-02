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
exports.getMember = exports.getMembers = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const member_model_1 = __importDefault(require("../model/member.model"));
const http_status_codes_1 = require("http-status-codes");
exports.getMembers = (0, catch_errors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const members = yield member_model_1.default.find({
        active: true,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        status: "success" /* ResponseStatues.SUCCESS */,
        message: "Members fetched successfully",
        data: {
            members,
        },
    });
}));
exports.getMember = (0, catch_errors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
