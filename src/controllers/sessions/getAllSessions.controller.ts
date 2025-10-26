import type { Request, Response } from "express";

import { getProjectSessions } from "../../services/sessions/getProjectSessions.service";
import { getUserSessions } from "../../services/sessions/getUserSessions.service";

export const getAllSessionsController = async (req: Request, res: Response) => {
  try {
    const { projectId, userId, name, limit, offset, orderBy, order } =
      req.query;

    if (projectId) {
      const sessions = await getProjectSessions({
        projectId: Number(projectId),
        name: name as string | undefined,
        limit: limit as number | undefined,
        offset: offset as number | undefined,
        orderBy: orderBy as
          | "name"
          | "createdAt"
          | "updatedAt"
          | "durationMinutes"
          | undefined,
        order: order as "ASC" | "DESC" | undefined,
      });
      return res.status(200).json(sessions);
    }

    if (userId) {
      const sessions = await getUserSessions({
        userId: Number(userId),
        name: name as string | undefined,
        limit: limit as number | undefined,
        offset: offset as number | undefined,
        orderBy: orderBy as
          | "name"
          | "createdAt"
          | "updatedAt"
          | "durationMinutes"
          | undefined,
        order: order as "ASC" | "DESC" | undefined,
      });
      return res.status(200).json(sessions);
    }

    return res
      .status(400)
      .json({ message: "Either projectId or userId must be provided" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
