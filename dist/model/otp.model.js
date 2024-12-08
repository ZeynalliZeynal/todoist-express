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
exports.OTPPurpose = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
var OTPPurpose;
(function (OTPPurpose) {
    OTPPurpose["EMAIL_VERIFICATION"] = "EMAIL_VERIFICATION";
    OTPPurpose["PASSWORD_RESET"] = "PASSWORD_RESET";
})(OTPPurpose || (exports.OTPPurpose = OTPPurpose = {}));
const schema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
    },
    purpose: {
        type: String,
        required: true,
        enum: OTPPurpose,
    },
    otp: {
        type: String,
        required: true,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "5m",
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});
schema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.otp = yield bcryptjs_1.default.hash(this.otp, 12);
        next();
    });
});
schema.method("generateOTP", function () {
    return crypto_1.default.randomInt(100000, 999999).toString();
});
schema.method("compareOTPs", function (candidateOTP, userOTP) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(candidateOTP, userOTP);
    });
});
exports.default = mongoose_1.default.model("OTP", schema);
