import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email format"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email format"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});
