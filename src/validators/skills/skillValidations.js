import { z } from "zod";

// ── Hex color regex ───────────────────────────────────────────────
const hexColor = z
  .string()
  .trim()
  .regex(
    /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
    "Color must be a valid hex value",
  )
  .default("#61DAFB");

// ═══════════════════════════════════════════════════════════════════
//  CREATE SCHEMA
//  - name, category → required, no default
//  - iconName       → optional string, defaults to "FaReact"
//  - color          → optional hex, defaults to "#61DAFB"
//  - order          → optional number, defaults to 0
// ═══════════════════════════════════════════════════════════════════
export const createSkillSchema = z.object({
  name: z
    .string({ required_error: "Skill name is required" })
    .trim()
    .min(1, "Skill name cannot be empty")
    .max(50, "Skill name cannot exceed 50 characters"),

  category: z.enum(["frontend", "backend"], {
    required_error: "Category is required",
    invalid_type_error: "Category must be 'frontend' or 'backend'",
  }),

  // ✅ .default() alone — no .optional() — default fires on undefined
  iconName: z
    .string()
    .trim()
    .min(1, "Icon name cannot be empty")
    .default("FaReact"),

  // ✅ .default() alone — no .optional()
  color: hexColor,

  // ✅ .default() alone — no .optional() after it
  order: z
    .number({ invalid_type_error: "Order must be a number" })
    .int("Order must be an integer")
    .min(0, "Order must be at least 0")
    .default(0),
});

// ═══════════════════════════════════════════════════════════════════
//  UPDATE SCHEMA
//  All fields truly optional — use z.optional() wrapper, NOT chained
// ═══════════════════════════════════════════════════════════════════
export const updateSkillSchema = z.object({
  // ✅ wrap in z.optional() — keeps field optional without breaking default
  name: z
    .string()
    .trim()
    .min(1, "Skill name cannot be empty")
    .max(50, "Skill name cannot exceed 50 characters")
    .optional(),

  category: z
    .enum(["frontend", "backend"], {
      invalid_type_error: "Category must be 'frontend' or 'backend'",
    })
    .optional(),

  iconName: z.string().trim().min(1, "Icon name cannot be empty").optional(),

  // ✅ For update — no default needed, just optional
  color: z
    .string()
    .trim()
    .regex(
      /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
      "Color must be a valid hex value",
    )
    .optional(),

  order: z
    .number({ invalid_type_error: "Order must be a number" })
    .int("Order must be an integer")
    .min(0, "Order must be at least 0")
    .optional(),
});
