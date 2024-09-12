import { z } from "zod"

export const courseSchema = z.object({
  duration: z
    .number({
      message: "Duration must be a number",
    })
    .min(1, {
      message: "Duration required",
    }),
  description: z
    .string({ message: "Description must be a string " })
    .nullable()
    .optional(),
  title: z
    .string({ message: "Title must be a string" })
    .min(1, "Title is required"),
  instructor: z
    .string({ message: "Instructor must be a string" })
    .min(1, "Instructor is required"),
})
