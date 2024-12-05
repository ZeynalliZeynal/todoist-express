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
exports.getUser = exports.getAllUsers = void 0;
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const user_model_1 = __importDefault(require("../model/user.model"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const filterObj = (obj, keys) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
        if (keys.includes(key))
            newObj[key] = obj[key];
    });
    return newObj;
};
exports.getAllUsers = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find();
    res.status(200).json({
        status: "success",
        length: users.length,
        data: {
            users,
        },
    });
}));
exports.getUser = (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.params.id).populate("tasks");
    if (!user)
        return next(new app_error_1.default("No user found by this id", 404));
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
}));
