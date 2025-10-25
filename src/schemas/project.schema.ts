import { z } from "zod";

export const projectSchema = z
  .object({
    id: z.number().int().positive().optional(),
    userId: z.number().int().positive().optional(),
    name: z.string(),
    description: z.string(),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i, {
      message: "Color must be a valid hex color (e.g., #FF5733 or #F57)",
    }),
    isActive: z.boolean(),
    track_time: z.boolean(),
    updated_at: z.union([z.date(), z.string()]).optional(),
    created_at: z.union([z.date(), z.string()]).optional(),
  })
  .strict();

export type Project = z.infer<typeof projectSchema>;
