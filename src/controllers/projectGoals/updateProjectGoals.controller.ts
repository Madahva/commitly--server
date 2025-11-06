import type { Request, Response } from "express";

import { updateProjectGoals } from "../../services/projectGoals/updateProjectGoals.service";

export const updateProjectGoalsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const [affectedCount, updatedProjects] = await updateProjectGoals(
      Number(id),
      body
    );

    if (affectedCount === 0) {
      return res.status(404).json({ message: "Project goal not found" });
    }

    return res.status(200).json(updatedProjects[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
