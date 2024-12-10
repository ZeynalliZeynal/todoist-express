"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupVerificationSchema = exports.signupSchema = exports.loginSchema = exports.nameSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z.string().email().min(1).max(255).trim();
exports.passwordSchema = zod_1.z.string().min(8).max(255);
exports.nameSchema = zod_1.z.string().min(1).max(255).trim();
exports.loginSchema = zod_1.z.object({
    // email: emailSchema,
    otp: zod_1.z.string().length(6).trim(),
    // password: z.string().min(1),
});
exports.signupSchema = exports.loginSchema.extend({
// name: nameSchema,
// password: passwordSchema,
// confirmPassword: z.string().min(1),
});
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });
exports.signupVerificationSchema = zod_1.z.object({
    email: exports.emailSchema,
    name: exports.nameSchema,
});
