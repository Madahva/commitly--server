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

export type ProjectGoal = z.infer<typeof projectGoalSchema>;
export type CreateProjectGoal = z.infer<typeof createProjectGoalSchema>;
