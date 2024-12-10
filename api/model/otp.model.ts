import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export enum OTPPurpose {
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  PASSWORD_RESET = "PASSWORD_RESET",
}

export interface OTPDocument extends mongoose.Document {
  email: string;
  createdAt: Date;
  expiresAt: Date;
  purpose: OTPPurpose;
  isUsed: boolean;
  otp: string;

  generateOTP(): string;

  compareOTPs(candidateOTP: string, userOTP: string): Promise<boolean>;

  createOTP(email: string, purpose: OTPPurpose): Promise<OTPDocument>;
}

const schema = new mongoose.Schema<OTPDocument>({
  email: {
    type: String,
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

schema.pre("save", async function (next) {
  this.otp = await bcrypt.hash(this.otp, 12);
  next();
});

schema.method("generateOTP", function (): string {
  return crypto.randomInt(100000, 999999).toString();
});

schema.method("compareOTPs", async function (candidateOTP, userOTP) {
  return await bcrypt.compare(candidateOTP, userOTP);
});

export default mongoose.model("OTP", schema);
