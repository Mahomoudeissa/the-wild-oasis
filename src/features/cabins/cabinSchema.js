import { z } from "zod";

export const cabinSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters"),

    maxCapacity: z
      .number({ error: "Please enter the maximum capacity" })
      .int("Capacity must be a whole number")
      .positive("Capacity must be greater than 0"),

    regularPrice: z
      .number({ error: "Please enter the regular price" })
      .positive("Price must be greater than 0"),

    discount: z
      .number({ error: "Please enter a valid discount" })
      .min(0, "Discount cannot be negative"),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters"),

    image: z.union([z.instanceof(File), z.string().url(), z.null()]),
  })
  .refine((data) => data.discount < data.regularPrice, {
    message: "Discount must be less than regular price",
    path: ["discount"],
  });
