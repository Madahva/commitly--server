import type { Request, Response } from "express";

import { createProjectGoal } from "../../services/projectGoals/creteProjectGoal.service";

export const createProjectGoalController = async (
  req: Request,
  res: Response
) => {
  try {
    const { body } = req;

    const projectGoal = await createProjectGoal(body);
    return res.status(201).json(projectGoal);
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred while processing your request",
    });
  }
};
