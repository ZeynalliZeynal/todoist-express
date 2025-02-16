"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = exports.setVerifyCookies = exports.setAuthCookies = exports.getVerifyTokenCookieOptions = exports.getRefreshTokenCookieOptions = exports.getAccessTokenCookieOptions = exports.refresh_path = void 0;
exports.getToken = getToken;
const env_1 = require("../constants/env");
const date_fns_1 = require("date-fns");
exports.refresh_path = "/api/v1/auth/refresh";
const secure = env_1.node_env !== "development";
const defaults = {
    sameSite: "strict",
    httpOnly: true,
    secure,
};
const getAccessTokenCookieOptions = () => (Object.assign(Object.assign({}, defaults), { expires: (0, date_fns_1.addDays)(new Date(), 30) }));
exports.getAccessTokenCookieOptions = getAccessTokenCookieOptions;
const getRefreshTokenCookieOptions = () => (Object.assign(Object.assign({}, defaults), { expires: (0, date_fns_1.addDays)(new Date(), 30), path: exports.refresh_path }));
exports.getRefreshTokenCookieOptions = getRefreshTokenCookieOptions;
const getVerifyTokenCookieOptions = () => (Object.assign(Object.assign({}, defaults), { expires: (0, date_fns_1.addMinutes)(new Date(), 5) }));
exports.getVerifyTokenCookieOptions = getVerifyTokenCookieOptions;
const setAuthCookies = ({ res, accessToken, refreshToken }) => res
    .cookie("accessToken", accessToken, (0, exports.getAccessTokenCookieOptions)())
    .cookie("refreshToken", refreshToken, (0, exports.getRefreshTokenCookieOptions)());
exports.setAuthCookies = setAuthCookies;
const setVerifyCookies = ({ res, verifyToken, }) => res.cookie("verifyToken", verifyToken, (0, exports.getVerifyTokenCookieOptions)());
exports.setVerifyCookies = setVerifyCookies;
const clearAuthCookies = (res) => res
    .clearCookie("accessToken")
    .clearCookie("refreshToken", {
    path: exports.refresh_path,
})
    .clearCookie("verifyToken");
exports.clearAuthCookies = clearAuthCookies;
function getToken(req, value) {
    var _a;
    const tokenFromCookies = req.cookies[value];
    const tokenFromHeaders = req.headers.authorization;
    const token = ((_a = tokenFromHeaders === null || tokenFromHeaders === void 0 ? void 0 : tokenFromHeaders.split("Bearer ")[1]) === null || _a === void 0 ? void 0 : _a.trim()) || tokenFromCookies;
    return token;
}
