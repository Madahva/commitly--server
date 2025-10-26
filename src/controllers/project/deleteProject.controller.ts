import type { Request, Response } from "express";

import { deleteProject } from "../../services/project/deleteProject.service";

export const deleteProjectController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCount = await deleteProject(Number(id));

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
