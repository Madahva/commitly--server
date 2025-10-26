import { z } from "zod";

export const sessionSchema = z
  .object({
    id: z.number().int().positive(),
    projectId: z.number().int().positive(),
    name: z.string(),
    description: z.string().optional(),
    note: z.string().optional(),
    durationMinutes: z.number().int().positive(),
    updatedAt: z.union([z.date(), z.string()]),
    createdAt: z.union([z.date(), z.string()]),
  })
  .strict();

export const createSessionSchema = sessionSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export const createSessionEndpointSchema = z.object({
  body: createSessionSchema,
});

export const getSessionEndpointSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a positive integer"),
  }),
});

export type Session = z.infer<typeof sessionSchema>;
export type CreateSession = z.infer<typeof createSessionSchema>;
