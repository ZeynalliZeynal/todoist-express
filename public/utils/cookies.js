"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = exports.setAuthCookies = exports.getRefreshTokenCookieOptions = exports.getAccessTokenCookieOptions = exports.refresh_path = void 0;
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
const setAuthCookies = ({ res, accessToken, refreshToken }) => res
    .cookie("accessToken", accessToken, (0, exports.getAccessTokenCookieOptions)())
    .cookie("refreshToken", refreshToken, (0, exports.getRefreshTokenCookieOptions)());
exports.setAuthCookies = setAuthCookies;
const clearAuthCookies = (res) => res.clearCookie("accessToken").clearCookie("refreshToken", {
    path: exports.refresh_path,
});
exports.clearAuthCookies = clearAuthCookies;
