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
exports.verifyEmail = exports.refreshUserAccessToken = exports.loginUser = exports.createAccount = void 0;
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
        role: env_1.admin_email === data.email ? "admin" : "user",
    });
    // create verification code
    const verificationToken = jsonwebtoken_1.default.sign({ userId: user._id }, env_1.jwt_verify_secret, {
        expiresIn: env_1.jwt_verify_expires_in,
    });
    // send verification email
    const url = `${env_1.client_dev_origin}/auth/email/verify/${verificationToken}`;
    try {
        yield (0, email_1.sendMail)(Object.assign({ to: [user.email] }, (0, email_templates_1.verifyEmailTemplate)(url)));
    }
    catch (err) {
        throw new app_error_1.default("Error occurred sending an email", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
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
        user,
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
