import type { Request, Response } from "express";

import { deleteProjectGoal } from "../../services/projectGoals/deleteProjectGoal.service";

export const deleteProjectGoalController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const deletedCount = await deleteProjectGoal(Number(id));

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
