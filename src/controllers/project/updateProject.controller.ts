import type { Request, Response } from "express";

import { updateProject } from "../../services/project/updateProject.service";

export const updateProjectController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const [affectedCount, updatedProjects] = await updateProject(
      Number(id),
      body
    );

    if (affectedCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(updatedProjects[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
