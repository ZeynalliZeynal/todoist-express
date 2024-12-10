import { CookieOptions, Response } from "express";
import { node_env } from "../constants/env";
import { addDays, addMinutes } from "date-fns";

export const refresh_path = "/api/v1/auth/refresh";
const secure = node_env !== "development";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: addDays(new Date(), 30),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: addDays(new Date(), 30),
  path: refresh_path,
});

export const getVerifyTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: addMinutes(new Date(), 5),
});

interface Params {
  res: Response;
  accessToken: string;
  refreshToken: string;
}

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) =>
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

export const setVerifyCookies = ({
  res,
  verifyToken,
}: {
  res: Response;
  verifyToken: string;
}) => res.cookie("verifyToken", verifyToken, getVerifyTokenCookieOptions());

export const clearAuthCookies = (res: Response) =>
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken", {
      path: refresh_path,
    })
    .clearCookie("verifyToken");
