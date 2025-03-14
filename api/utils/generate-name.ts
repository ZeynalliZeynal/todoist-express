import crypto from "crypto";

export const generateName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
