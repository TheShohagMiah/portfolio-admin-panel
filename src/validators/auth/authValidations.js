import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .lowercase()
    .email("Please fill a valid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[@$!%*?&]/, "Must contain at least one special character"),
});

export const registerSchema = loginSchema
  .extend({
    fullName: z
      .string({ required_error: "Name is required" })
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name is too long"),

    role: z
      .enum(["user", "admin", "moderator"], {
        errorMap: () => ({ message: "Invalid role selected" }),
      })
      .default("user"),

    confirmPassword: z.string({
      required_error: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── NEW ────────────────────────────────────────────────────────
export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "Current password is required" })
      .min(1, "Current password cannot be empty"),

    // loginSchema থেকে password rules reuse করো
    newPassword: loginSchema.shape.password,

    confirmPassword: z.string({
      required_error: "Please confirm your new password",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });
