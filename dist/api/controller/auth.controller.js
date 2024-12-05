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
exports.resetPassword = exports.forgotPassword = exports.updatePassword = exports.authorizeTo = exports.refreshToken = exports.verifyEmailController = exports.logout = exports.login = exports.signup = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const catch_errors_2 = __importDefault(require("../utils/catch-errors"));
const app_error_1 = __importDefault(require("../utils/app-error"));
const crypto_1 = __importDefault(require("crypto"));
const auth_schema_1 = require("../validator/auth.schema");
const auth_service_1 = require("../service/auth.service");
const http_status_codes_1 = require("http-status-codes");
const cookies_1 = require("../utils/cookies");
const jwt_1 = require("../utils/jwt");
const session_model_1 = __importDefault(require("../model/session.model"));
const app_assert_1 = __importDefault(require("../utils/app-assert"));
const email_templates_1 = require("../utils/email-templates");
const email_1 = require("../utils/email");
const env_1 = require("../constants/env");
exports.signup = (0, catch_errors_2.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const request = auth_schema_1.signupSchema.parse(Object.assign(Object.assign({}, req.body), { userAgent: req.headers["user-agent"] }));
    const { refreshToken, accessToken, user } = yield (0, auth_service_1.createAccount)(request);
    return (0, cookies_1.setAuthCookies)({ res, refreshToken, accessToken })
        .status(http_status_codes_1.StatusCodes.OK)
        .json({
        status: "success",
        message: "Verification email sent. Please verify your email to continue.",
    });
}));
exports.login = (0, catch_errors_2.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const request = auth_schema_1.loginSchema.parse(Object.assign(Object.assign({}, req.body), { userAgent: req.headers["user-agent"] }));
    const { accessToken, refreshToken } = yield (0, auth_service_1.loginUser)(request);
    return (0, cookies_1.setAuthCookies)({ res, refreshToken, accessToken })
        .status(http_status_codes_1.StatusCodes.OK)
        .json({
        status: "success",
        message: "Login successful",
    });
}));
exports.logout = (0, catch_errors_2.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accessToken;
    const { payload } = (0, jwt_1.verifyToken)(accessToken);
    if (payload)
        yield session_model_1.default.findByIdAndDelete(payload.sessionId);
    return (0, cookies_1.clearAuthCookies)(res).status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        message: "Logout successful",
    });
}));
exports.verifyEmailController = (0, catch_errors_2.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_service_1.verifyEmail)(req.params.token);
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "Email was successfully verified",
    });
}));
exports.refreshToken = (0, catch_errors_2.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    (0, app_assert_1.default)(refreshToken, "Missing refresh token", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    const { newRefreshToken, accessToken } = yield (0, auth_service_1.refreshUserAccessToken)(refreshToken);
    if (newRefreshToken) {
        res.cookie("refreshToken", newRefreshToken, (0, cookies_1.getRefreshTokenCookieOptions)());
    }
    return res
        .status(http_status_codes_1.StatusCodes.OK)
        .cookie("accessToken", accessToken, (0, cookies_1.getAccessTokenCookieOptions)())
        .json({
        status: "success",
        message: "Access token refreshed",
    });
}));
const authorizeTo = (roles) => (0, catch_errors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.userId).select("+role");
    if (!user || !roles.includes(user.role)) {
        return next(new app_error_1.default("You do not have permission to perform this action.", http_status_codes_1.StatusCodes.FORBIDDEN));
    }
    next();
}));
exports.authorizeTo = authorizeTo;
exports.updatePassword = (0, catch_errors_2.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.userId).select("+password");
    if (!user)
        return next(new app_error_1.default("You are not logged in.", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    if (!(yield user.comparePasswords(req.body.passwordCurrent, user.password)))
        return next(new app_error_1.default("Password is incorrect.", http_status_codes_1.StatusCodes.UNAUTHORIZED));
    const session = yield session_model_1.default.findById(req.sessionId);
    if (!session)
        return next(new app_error_1.default("No session found.", http_status_codes_1.StatusCodes.NOT_FOUND));
    yield session_model_1.default.deleteMany({
        userId: req.userId,
        _id: { $ne: req.sessionId },
    });
    const accessToken = (0, jwt_1.signToken)({
        sessionId: session._id,
        userId: user._id,
    });
    const refreshToken = (0, jwt_1.signToken)({ sessionId: session._id }, jwt_1.refreshTokenSignOptions);
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    yield user.save();
    return (0, cookies_1.setAuthCookies)({ res, accessToken, refreshToken })
        .status(http_status_codes_1.StatusCodes.OK)
        .json({
        status: "success",
        message: "Password changed successfully.",
    });
}));
exports.forgotPassword = (0, catch_errors_2.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: req.body.email });
    if (!user)
        return next(new app_error_1.default("No user with this email.", http_status_codes_1.StatusCodes.NOT_FOUND));
    const resetToken = user.createResetPasswordToken();
    yield user.save({
        validateBeforeSave: false,
    });
    const url = `${env_1.client_dev_origin}/auth/password/reset/${resetToken}`;
    try {
        yield (0, email_1.sendMail)(Object.assign({ to: [user.email] }, (0, email_templates_1.verifyEmailTemplate)(url)));
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "success",
            message: "Check your email.",
        });
    }
    catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new app_error_1.default("Failed to send the token to your email.", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR));
    }
}));
exports.resetPassword = (0, catch_errors_2.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = yield user_model_1.default.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
            $gte: Date.now(),
        },
    });
    if (!user)
        return next(new app_error_1.default("Token is invalid or has expired. Try again.", 400));
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;
    yield user.save();
    yield session_model_1.default.deleteMany({
        userId: user._id,
    });
    return (0, cookies_1.clearAuthCookies)(res).status(http_status_codes_1.StatusCodes.OK).json({
        status: "success",
        message: "Password reset successfully. You need to log in with your new password.",
    });
}));
