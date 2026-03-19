import { z } from "zod";

export const aboutValidationSchema = z.object({
  // ── Executive Summary ──────────────────────────────────────────
  title: z.string().min(1, "Title is required").trim(),
  bio: z.string().min(20, "Bio should be at least 20 characters").trim(),

  // ── Quick Stats ────────────────────────────────────────────────
  experienceYears: z.string().default(""),
  location: z.string().default(""),
  freelanceStatus: z.enum(["available", "busy", "unavailable"]),

  // ── Academic Timeline ──────────────────────────────────────────
  education: z
    .array(
      z.object({
        courseTitle: z.string().min(1, "Course title is required"),
        subject: z.string().min(1, "Subject is required"),
        institution: z.string().min(1, "Institution is required"),
        description: z.string().optional().default(""),

        duration: z.object({
          from: z.string().min(1, "Start year is required"),
          // ✅ Mongoose requires it — keep min(1) so empty string is rejected
          to: z.string().min(1, "End year is required"),
        }),

        status: z.enum(["ongoing", "completed"]),
      }),
    )
    .default([]),

  // ── Media Assets ──────────────────────────────────────────────
  profileImage: z
    .object({
      // ✅ Matches Mongoose defaults of ""
      url: z.string().default(""),
      public_id: z.string().default(""),
    })
    .optional(),

  // ✅ Fixed: matches Mongoose field name "resume" (not "resumeUrl")
  resume: z
    .object({
      url: z
        .string()
        .trim()
        .refine(
          (val) => val === "" || z.string().url().safeParse(val).success,
          { message: "Must be a valid URL (e.g. https://example.com)" },
        )
        .default(""),
      public_id: z.string().default(""),
    })
    .optional(),
});
