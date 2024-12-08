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
exports.verifyEmail = exports.verifyOTP = exports.refreshUserAccessToken = exports.loginUser = exports.createAccount = exports.sendOTPEmailVerification = exports.createEmailVerificationOTP = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const env_1 = require("../constants/env");
const session_model_1 = __importDefault(require("../model/session.model"));
const app_assert_1 = __importDefault(require("../utils/app-assert"));
const http_status_codes_1 = require("http-status-codes");
const jwt_1 = require("../utils/jwt");
const app_error_1 = __importDefault(require("../utils/app-error"));
const email_1 = require("../utils/email");
const email_templates_1 = require("../utils/email-templates");
const date_fns_1 = require("date-fns");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otp_model_1 = __importStar(require("../model/otp.model"));
const crypto_1 = __importDefault(require("crypto"));
const createEmailVerificationOTP = (email, otp, purpose) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.exists({ email, verified: false });
    if (!user)
        throw new app_error_1.default("The user is already verified", http_status_codes_1.StatusCodes.NOT_FOUND);
    const existingOTP = yield otp_model_1.default.exists({ email });
    if (existingOTP)
        throw new app_error_1.default("You cannot create a new request while one already existed.", http_status_codes_1.StatusCodes.BAD_REQUEST);
    const newOtp = yield otp_model_1.default.create({
        email,
        otp,
        purpose,
        expiresAt: (0, date_fns_1.addMinutes)(Date.now(), 5),
    });
    return newOtp;
});
exports.createEmailVerificationOTP = createEmailVerificationOTP;
const sendOTPEmailVerification = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.default.findOne({ email });
    if (!existingUser)
        throw new app_error_1.default("Email is incorrect", http_status_codes_1.StatusCodes.NOT_FOUND);
    const otp = crypto_1.default.randomInt(100000, 999999).toString();
    const url = `${env_1.client_dev_origin}/auth/login/email`;
    yield (0, exports.createEmailVerificationOTP)(email, otp, otp_model_1.OTPPurpose.EMAIL_VERIFICATION);
    try {
        yield (0, email_1.sendMail)(Object.assign({ to: [email] }, (0, email_templates_1.otpVerificationEmail)({
            otp,
            url,
            auth: "sign up",
            username: existingUser.name,
        })));
    }
    catch (err) {
        throw new app_error_1.default("Error occurred sending an email", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
});
exports.sendOTPEmailVerification = sendOTPEmailVerification;
const createAccount = (data) => __awaiter(void 0, void 0, void 0, function* () {
    //   verify that user doesn't exist
    const existingUser = yield user_model_1.default.exists({
        email: data.email,
    });
    (0, app_assert_1.default)(!existingUser, "Email already in use", http_status_codes_1.StatusCodes.CONFLICT);
    // create new user
    const user = yield user_model_1.default.create({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        location: data.location,
        role: env_1.admin_email === data.email ? "admin" : "user",
    });
    /*
                                        // create verification code
                                        const verificationToken = jwt.sign({ userId: user._id }, jwt_verify_secret, {
                                          expiresIn: jwt_verify_expires_in,
                                        });
                                      
                                        // send verification email
                                        const url = `${client_dev_origin}/auth/email/verify/${verificationToken}`;
                                         */
    yield (0, exports.sendOTPEmailVerification)(user.email);
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
const loginUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, userAgent, }) {
    // get user by email
    const user = yield user_model_1.default.findOne({ email }).select("+password");
    (0, app_assert_1.default)(user, "Email or password is incorrect", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    // validate password
    const isPasswordValid = yield user.comparePasswords(password, user.password);
    (0, app_assert_1.default)(isPasswordValid, "Invalid email or password", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    const userId = user.id;
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
const verifyOTP = (otp, email, purpose) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield user_model_1.default.findOne({ email });
    if (!findUser)
        throw new app_error_1.default("Email is incorrect.", http_status_codes_1.StatusCodes.NOT_FOUND);
    const findOTP = yield otp_model_1.default.findOne({
        email,
        purpose,
        expiresAt: { $gte: Date.now() },
        isUsed: false,
    });
    if (!findOTP)
        throw new app_error_1.default("OTP has expired.", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    const isMatch = yield findOTP.compareOTPs(otp, findOTP.otp);
    if (!isMatch)
        throw new app_error_1.default("OTP is incorrect. Please try again.", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    findUser.verifiedAt = new Date();
    findUser.verified = true;
    findOTP.isUsed = true;
    yield findUser.save({
        validateBeforeSave: false,
    });
    yield findOTP.save();
});
exports.verifyOTP = verifyOTP;
const verifyEmail = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, env_1.jwt_verify_secret);
    if (!decoded)
        throw new app_error_1.default("Invalid or expired token", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    const userId = decoded.userId;
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, {
        verified: true,
        verifiedAt: Date.now(),
    }, { new: true });
    if (!updatedUser)
        throw new app_error_1.default("User not found", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    return {
        user: updatedUser,
    };
});
exports.verifyEmail = verifyEmail;
