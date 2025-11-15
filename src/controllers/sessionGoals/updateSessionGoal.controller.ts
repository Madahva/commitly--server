import type { Request, Response } from "express";

import { updateSessionGoal } from "../../services/sessionGoals/updateSessionGoal.service";

export const updateSessionGoalController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const [affectedCount, updatedSessionGoals] = await updateSessionGoal(
      Number(id),
      body
    );

    if (affectedCount === 0) {
      return res.status(404).json({ message: "Session goal not found" });
    }

    return res.status(200).json(updatedSessionGoals[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
