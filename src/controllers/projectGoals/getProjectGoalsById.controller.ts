import type { Request, Response } from "express";

import { getProjectGoalById } from "../../services/projectGoals/getProjectGoalById.service";

export const getProjectGoalByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const projectGoal = await getProjectGoalById(Number(id));

    if (!projectGoal) {
      return res.status(404).json({ message: "Project Goal not found" });
    }

    return res.status(200).json(projectGoal);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
