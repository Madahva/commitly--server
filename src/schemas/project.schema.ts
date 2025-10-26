import { z } from "zod";

export const projectSchema = z
  .object({
    id: z.number().int().positive(),
    userId: z.number().int().positive(),
    name: z.string(),
    description: z.string(),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i, {
      message: "Color must be a valid hex color (e.g., #FF5733 or #F57)",
    }),
    isActive: z.boolean(),
    trackTime: z.boolean(),
    updatedAt: z.union([z.date(), z.string()]),
    createdAt: z.union([z.date(), z.string()]),
  })
  .strict();

export const createProjectSchema = projectSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export const createProjectEndpointSchema = z.object({
  body: createProjectSchema,
});

export const getProjectEndpointSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a positive integer"),
  }),
});

export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
