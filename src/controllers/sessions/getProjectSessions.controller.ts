import type { Request, Response } from "express";

import { getProjectSessions } from "../../services/sessions/getProjectSessions.service";

export const getProjectSessionsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { projectId, name, limit, offset, orderBy, order } = req.query;

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
