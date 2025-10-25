import type { Request, Response } from "express";

import { createProject } from "../../services/project/createProject.service";

export const createProjectController = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const project = await createProject(body);
    return res.status(201).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
