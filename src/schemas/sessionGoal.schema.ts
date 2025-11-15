import z from "zod";

export const sessionGoalSchema = z
  .object({
    id: z.number().int().positive(),
    sessionId: z.number().int().positive(),
    name: z.string(),
    description: z.string().optional(),
    status: z.enum(["pending", "on progress", "completed"]),
    updatedAt: z.union([z.date(), z.string()]),
    createdAt: z.union([z.date(), z.string()]),
  })
  .strict();

export const createSessionGoalSchema = sessionGoalSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export const createSessionGoalEndpointSchema = z.object({
  body: createSessionGoalSchema,
});

export const listSessionGoalsEndpointSchema = z.object({
  query: z.object({
    sessionId: z.coerce.number().int().positive(),
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
    orderBy: z.enum(["name", "createdAt", "updatedAt", "status"]).optional(),
    order: z.enum(["ASC", "DESC"]).optional(),
  }),
});

export type ListSessionGoalsQuery = z.infer<
  typeof listSessionGoalsEndpointSchema
>["query"];
export type CreateSessionGoal = z.infer<typeof createSessionGoalSchema>;
