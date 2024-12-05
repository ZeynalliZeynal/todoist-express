import jwt, { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import {
  jwt_expires_in,
  jwt_refresh_expires_in,
  jwt_refresh_secret,
  jwt_secret,
} from "../constants/env";
import { SessionDocument } from "../model/session.model";
import mongoose from "mongoose";

export interface RefreshTokenPayload extends JwtPayload {
  sessionId: SessionDocument["_id"];
}

export interface AccessTokenPayload extends JwtPayload {
  userId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
}

const defaults = {
  audience: ["user"],
};

const accessTokenSignOptions = {
  expiresIn: jwt_expires_in,
  secret: jwt_secret,
};

export const refreshTokenSignOptions = {
  expiresIn: jwt_refresh_expires_in,
  secret: jwt_refresh_secret,
};

export const signToken = (
  payload: JwtPayload,
  options?: SignOptions & { secret: string },
) => {
  const { secret, ...signOptions } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, { ...signOptions, ...defaults });
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret: string },
) => {
  const { secret = jwt_secret, ...verifyOptions } = options || {};

  try {
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...verifyOptions,
    }) as TPayload;

    return {
      payload,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
