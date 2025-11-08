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

export type CreateSessionGoal = z.infer<typeof createSessionGoalSchema>;
