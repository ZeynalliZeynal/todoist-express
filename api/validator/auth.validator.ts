import { z } from "zod";

export const emailSchema = z.string().email().min(1).max(255).trim();
export const passwordSchema = z.string().min(8).max(255);
export const nameSchema = z.string().min(1).max(255).trim();

export const loginSchema = z.object({
  // email: emailSchema,
  otp: z.string().length(6).trim(),
  // password: z.string().min(1),
});

export const signupSchema = loginSchema.extend({
  // name: nameSchema,
  // password: passwordSchema,
  // confirmPassword: z.string().min(1),
});
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

export const signupVerificationSchema = z.object({
  email: emailSchema,
  name: nameSchema,
});
