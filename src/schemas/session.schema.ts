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

export const updateSessionSchema = sessionSchema
  .omit({
    id: true,
    projectId: true,
    updatedAt: true,
    createdAt: true,
  })
  .partial();

export const createSessionEndpointSchema = z.object({
  body: createSessionSchema,
});

export const getSessionEndpointSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a positive integer"),
  }),
});

export const updateSessionEndpointSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a positive integer"),
  }),
  body: updateSessionSchema,
});

export const deleteSessionEndpointSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a positive integer"),
  }),
});

export const listSessionsEndpointSchema = z.object({
  query: z
    .object({
      projectId: z
        .string()
        .regex(/^\d+$/, "Project ID must be a positive integer")
        .optional(),
      userId: z
        .string()
        .regex(/^\d+$/, "User ID must be a positive integer")
        .optional(),
      name: z.string().optional(),
      limit: z
        .string()
        .regex(/^\d+$/, "Limit must be a positive integer")
        .optional()
        .transform((val) => (val ? Number(val) : undefined)),
      offset: z
        .string()
        .regex(/^\d+$/, "Offset must be a non-negative integer")
        .optional()
        .transform((val) => (val ? Number(val) : undefined)),
      orderBy: z
        .enum(["name", "createdAt", "updatedAt", "durationMinutes"])
        .optional(),
      order: z.enum(["ASC", "DESC"]).optional(),
    })
    .refine((data) => data.projectId || data.userId, {
      message: "Either projectId or userId must be provided",
    }),
});

export const listUserSessionsEndpointSchema = z.object({
  query: z.object({
    userId: z.string().regex(/^\d+$/, "User ID must be a positive integer"),
    name: z.string().optional(),
    limit: z
      .string()
      .regex(/^\d+$/, "Limit must be a positive integer")
      .optional()
      .transform((val) => (val ? Number(val) : undefined)),
    offset: z
      .string()
      .regex(/^\d+$/, "Offset must be a non-negative integer")
      .optional()
      .transform((val) => (val ? Number(val) : undefined)),
    orderBy: z
      .enum(["name", "createdAt", "updatedAt", "durationMinutes"])
      .optional(),
    order: z.enum(["ASC", "DESC"]).optional(),
  }),
});

export type Session = z.infer<typeof sessionSchema>;
export type CreateSession = z.infer<typeof createSessionSchema>;
export type UpdateSession = z.infer<typeof updateSessionSchema>;
