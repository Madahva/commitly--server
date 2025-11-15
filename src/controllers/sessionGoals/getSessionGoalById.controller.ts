import type { Request, Response } from "express";

import { getSessionGoalById } from "../../services/sessionGoals/getSessionGoalById.service";

export const getSessionGoalByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const sessionGoal = await getSessionGoalById(Number(id));

    if (!sessionGoal) {
      return res.status(404).json({ message: "Session Goal not found" });
    }

    return res.status(200).json(sessionGoal);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
