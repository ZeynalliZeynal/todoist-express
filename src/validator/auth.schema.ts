import { z } from "zod";

export const emailSchema = z.string().email().min(1).max(255).trim();
export const passwordSchema = z.string().min(8).max(255);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
  userAgent: z.string().optional(),
});

export const signupSchema = loginSchema
  .extend({
    name: z.string().min(1).max(50).trim(),
    password: passwordSchema,
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const verificationCodeSchema = z.string().min(1).max(24);
