import type { Request, Response, NextFunction } from "express";

import { getUserById } from "../services/users/getUserById.service";
import { getProjectById } from "../services/projects/getProject.service";
import { getSessionById } from "../services/sessions/getSession.service";

export const verifySessionOwnership = async (
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

    const session = await getSessionById(Number(id));

    if (!session) {
      return res.status(404).json({
        error: "SESSION_NOT_FOUND",
        message: `Session with id ${id} does not exist`,
      });
    }

    const project = await getProjectById(session.projectId);

    if (!project) {
      return res.status(404).json({
        error: "PROJECT_NOT_FOUND",
        message: `Project with id ${session.projectId} does not exist`,
      });
    }

    const user = await getUserById(project.userId);

    if (!user) {
      return res.status(404).json({
        error: "USER_NOT_FOUND",
        message: `User with id ${project.userId} does not exist`,
      });
    }

    if (user.sub !== sub) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "You do not have permission to access this session resource",
      });
    }

    next();
  } catch (error) {
    req.log.error(error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred while verifying user ownership",
    });
  }
};
