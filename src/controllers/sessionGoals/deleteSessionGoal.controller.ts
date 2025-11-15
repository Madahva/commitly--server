import type { Request, Response } from "express";

import { deleteSessionGoal } from "../../services/sessionGoals/deleteSessionGoal.service";

export const deleteSessionGoalController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const deletedCount = await deleteSessionGoal(Number(id));

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Session goal not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
