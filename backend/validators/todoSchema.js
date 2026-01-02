import { z } from "zod";

export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required"),

  description: z
    .string()
    .optional(),

  completed: z
    .boolean()
    .optional(),  
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .optional(),

  description: z
    .string()
    .optional(),

  completed: z
    .boolean()
    .optional(),
});
