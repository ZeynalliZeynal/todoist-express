"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.verifyOTP = exports.refreshUserAccessToken = exports.loginUser = exports.createAccount = exports.sendSignupEmailVerification = exports.sendLoginEmailVerification = exports.createEmailVerificationOTP = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const env_1 = require("../constants/env");
const session_model_1 = __importDefault(require("../model/session.model"));
const http_status_codes_1 = require("http-status-codes");
const jwt_1 = require("../utils/jwt");
const app_error_1 = __importDefault(require("../utils/app-error"));
const email_1 = require("../utils/email");
const email_templates_1 = require("../utils/email-templates");
const date_fns_1 = require("date-fns");
const otp_model_1 = __importStar(require("../model/otp.model"));
const crypto_1 = __importDefault(require("crypto"));
const plan_model_1 = __importDefault(require("../model/plan.model"));
const createEmailVerificationOTP = (data, purpose) => __awaiter(void 0, void 0, void 0, function* () {
    const existingOtp = yield otp_model_1.default.exists({ email: data.email, isUsed: false });
    if (existingOtp)
        throw new app_error_1.default("Email verification in progress. Please check your inbox and spam folder.", http_status_codes_1.StatusCodes.CONFLICT, "EMAIL_VERIFICATION_CONFLICT" /* ErrorCodes.EMAIL_VERIFICATION_CONFLICT */);
    const newOtp = yield otp_model_1.default.create({
        email: data.email,
        otp: data.otp,
        purpose,
        expiresAt: (0, date_fns_1.addMinutes)(Date.now(), 5),
    });
    const token = (0, jwt_1.signToken)({ otpId: newOtp._id, name: data.name, email: data.email }, jwt_1.verificationTokenSignOptions);
    return token;
});
exports.createEmailVerificationOTP = createEmailVerificationOTP;
const sendLoginEmailVerification = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, }) {
    const existingUser = yield user_model_1.default.findOne({ email });
    if (!existingUser)
        throw new app_error_1.default("Email is incorrect.", http_status_codes_1.StatusCodes.NOT_FOUND);
    const otp = crypto_1.default.randomInt(100000, 999999).toString();
    const token = yield (0, exports.createEmailVerificationOTP)({
        otp,
        name: existingUser.name,
        email,
    }, otp_model_1.OTPPurpose.EMAIL_VERIFICATION);
    const url = `${env_1.client_dev_origin}/auth/login/email?token=${token}`;
    try {
        yield (0, email_1.sendMail)(Object.assign({ to: [email] }, (0, email_templates_1.otpVerificationEmail)({
            otp,
            url,
            auth: "log in",
            username: existingUser.name,
            location: existingUser.location,
        })));
        return token;
    }
    catch (err) {
        throw new app_error_1.default("Error occurred sending an email", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
});
exports.sendLoginEmailVerification = sendLoginEmailVerification;
const sendSignupEmailVerification = (_a, location_1) => __awaiter(void 0, [_a, location_1], void 0, function* ({ name, email, }, location) {
    const otp = crypto_1.default.randomInt(100000, 999999).toString();
    const token = yield (0, exports.createEmailVerificationOTP)({
        email,
        otp,
        name,
    }, otp_model_1.OTPPurpose.EMAIL_VERIFICATION);
    const existingUser = yield user_model_1.default.exists({ email });
    if (existingUser)
        throw new app_error_1.default("Email is already in use.", http_status_codes_1.StatusCodes.CONFLICT);
    const url = `${env_1.client_dev_origin}/auth/signup/email?token=${token}`;
    try {
        yield (0, email_1.sendMail)(Object.assign({ to: [email] }, (0, email_templates_1.otpVerificationEmail)({
            otp,
            url,
            auth: "sign up",
            username: name,
            location,
        })));
        return token;
    }
    catch (err) {
        throw new app_error_1.default("Error occurred sending an email", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
});
exports.sendSignupEmailVerification = sendSignupEmailVerification;
const createAccount = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // verify entered email. if not verified, the error will be thrown
    const { name, email } = yield (0, exports.verifyOTP)(data.otp, data.verifyToken, otp_model_1.OTPPurpose.EMAIL_VERIFICATION);
    const plan = yield plan_model_1.default.findOne({
        name: {
            $regex: data.plan,
            $options: "i",
        },
    });
    if (!plan)
        throw new app_error_1.default("Plan name is incorrect", http_status_codes_1.StatusCodes.NOT_FOUND);
    const user = yield user_model_1.default.create({
        email,
        name,
        verified: true,
        verifiedAt: new Date(),
        location: data.location,
        role: env_1.admin_email === email ? "admin" : "user",
        planId: plan._id,
    });
    // create session
    const session = yield session_model_1.default.create({
        userId: user._id,
        userAgent: data.userAgent,
    });
    const sessionInfo = {
        sessionId: session._id,
    };
    const refreshToken = (0, jwt_1.signToken)(sessionInfo, jwt_1.refreshTokenSignOptions);
    const accessToken = (0, jwt_1.signToken)(Object.assign({ userId: user._id }, sessionInfo));
    return {
        accessToken,
        refreshToken,
    };
});
exports.createAccount = createAccount;
const loginUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ otp, verifyToken, userAgent, }) {
    // verify the user's email
    const { email } = yield (0, exports.verifyOTP)(otp, verifyToken, otp_model_1.OTPPurpose.EMAIL_VERIFICATION);
    const user = yield user_model_1.default.findOneAndUpdate({ email }, {
        verified: true,
        verifiedAt: Date.now(),
    }, { new: true });
    if (!user)
        throw new app_error_1.default("Email is incorrect.", http_status_codes_1.StatusCodes.NOT_FOUND);
    // validate password
    // const isPasswordValid = await user!.comparePasswords(
    //   password,
    //   user!.password,
    // );
    // appAssert(
    //   isPasswordValid,
    //   "Invalid email or password",
    //   StatusCodes.UNAUTHORIZED,
    // );
    const userId = user._id;
    // create a session
    const session = yield session_model_1.default.create({
        userId,
        userAgent,
    });
    // sign access token & refresh token
    const refreshToken = (0, jwt_1.signToken)({ sessionId: session._id }, jwt_1.refreshTokenSignOptions);
    const accessToken = (0, jwt_1.signToken)({
        sessionId: session._id,
        userId: userId,
    });
    // return user & tokens
    return {
        user,
        accessToken,
        refreshToken,
    };
});
exports.loginUser = loginUser;
const refreshUserAccessToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const { payload } = (0, jwt_1.verifyToken)(token, {
        secret: env_1.jwt_refresh_secret,
    });
    if (!payload)
        throw new app_error_1.default("Invalid token", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    const session = yield session_model_1.default.findById(payload.sessionId);
    if (!session && session.expiresAt.getTime() > Date.now())
        throw new app_error_1.default("Session expired", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    const sessionNeedsRefresh = session.expiresAt.getTime() - Date.now() <= 24 * 60 * 60 * 1000;
    if (sessionNeedsRefresh) {
        session.expiresAt = (0, date_fns_1.addDays)(new Date(), 30);
        yield session.save();
    }
    const newRefreshToken = sessionNeedsRefresh
        ? (0, jwt_1.signToken)({
            sessionId: session._id,
        }, jwt_1.refreshTokenSignOptions)
        : undefined;
    const accessToken = (0, jwt_1.signToken)({
        userId: session.userId,
        sessionId: session._id,
    });
    return {
        accessToken,
        newRefreshToken,
    };
});
exports.refreshUserAccessToken = refreshUserAccessToken;
const verifyOTP = (otp, token, purpose) => __awaiter(void 0, void 0, void 0, function* () {
    const { payload } = (0, jwt_1.verifyToken)(token, {
        secret: env_1.jwt_verify_secret,
    });
    if (!payload)
        throw new app_error_1.default("Token is invalid or expired.", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    const existingOtp = yield otp_model_1.default.findById({
        _id: payload.otpId,
        email: payload.email,
        purpose,
        expiresAt: { $gte: Date.now() },
        isUsed: false,
    });
    if (!existingOtp)
        throw new app_error_1.default("The code has expired. Request a new one.", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    if (existingOtp.isUsed)
        throw new app_error_1.default("This code is already used. Please request a new one.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const isMatch = yield existingOtp.compareOTPs(otp, existingOtp.otp);
    if (!isMatch)
        throw new app_error_1.default("The entered code is incorrect. Please try again and check for typos.", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    existingOtp.isUsed = true;
    yield existingOtp.save({
        validateBeforeSave: false,
    });
    return {
        name: payload.name,
        email: payload.email,
    };
});
exports.verifyOTP = verifyOTP;
