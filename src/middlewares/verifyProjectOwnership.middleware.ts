import type { Request, Response, NextFunction } from "express";

import { getUserById } from "../services/users/getUserById.service";
import { getProjectById } from "../services/projects/getProject.service";

export const verifyProjectOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const sub = req.auth?.payload?.sub;

    if (!sub) {
      return next();
    }

    const project = await getProjectById(Number(id));

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = await getUserById(project.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.sub !== sub) {
      return res
        .status(403)
        .json({ message: "Unauthorized - Resource not owned by user" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
