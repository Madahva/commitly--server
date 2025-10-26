import type { Request, Response } from "express";

import { getProjectById } from "../../services/projects/getProject.service";

export const getProjectController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await getProjectById(Number(id));

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
