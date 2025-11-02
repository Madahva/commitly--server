import z from "zod";

export const projectGoalSchema = z
  .object({
    id: z.number().int().positive(),
    projectId: z.number().int().positive(),
    name: z.string(),
    description: z.string().optional(),
    status: z.enum(["pending", "on progress", "completed"]),
    updatedAt: z.union([z.date(), z.string()]),
    createdAt: z.union([z.date(), z.string()]),
  })
  .strict();

export const createProjectGoalSchema = projectGoalSchema.omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export const createProjectGoalEndpointSchema = z.object({
  body: createProjectGoalSchema,
});

export const deleteProjectGoalEndpointSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const listProjectGoalsEndpointSchema = z.object({
  query: z.object({
    projectId: z.coerce.number().int().positive(),
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

export const getProjectGoalByIdEndpointSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export type ListProjectGoalsQuery = z.infer<
  typeof listProjectGoalsEndpointSchema
>["query"];
export type ProjectGoal = z.infer<typeof projectGoalSchema>;
export type CreateProjectGoal = z.infer<typeof createProjectGoalSchema>;
