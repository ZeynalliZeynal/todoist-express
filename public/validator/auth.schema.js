"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationCodeSchema = exports.signupSchema = exports.loginSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z.string().email().min(1).max(255).trim();
exports.passwordSchema = zod_1.z.string().min(8).max(255);
exports.loginSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: zod_1.z.string().min(1),
    userAgent: zod_1.z.string().optional(),
});
exports.signupSchema = exports.loginSchema
    .extend({
    name: zod_1.z.string().min(1).max(50).trim(),
    password: exports.passwordSchema,
    confirmPassword: zod_1.z.string().min(1),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
exports.verificationCodeSchema = zod_1.z.string().min(1).max(24);
