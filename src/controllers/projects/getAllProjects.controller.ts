import type { Request, Response } from "express";

import { getAllProjects } from "../../services/projects/getAllProjects.service";

export const getAllProjectsController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const projects = await getAllProjects(Number(userId));
    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
