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
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
