import type { Request, Response, NextFunction } from "express";
import { getUserById } from "../services/users/getUserById.service";

export const verifyUserOwnership = async (
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

    const userId = Number(id);
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: "USER_NOT_FOUND",
        message: `User with id ${userId} does not exist`,
      });
    }

    if (user.sub !== sub) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "You do not have permission to access this user resource",
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
