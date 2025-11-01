import type { Request, Response } from "express";

import { getProjectGoals } from "../../services/projectGoals/getProjectGoals.service";

export const getProjectGoalsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { projectId, name, limit, offset, orderBy, order } = req.query;

    const projectGoals = await getProjectGoals({
      projectId: Number(projectId),
      name: name as string | undefined,
      limit: limit as number | undefined,
      offset: offset as number | undefined,
      orderBy: orderBy as
        | "name"
        | "createdAt"
        | "updatedAt"
        | "durationMinutes"
        | undefined,
      order: order as "ASC" | "DESC" | undefined,
    });
    return res.status(200).json(projectGoals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
