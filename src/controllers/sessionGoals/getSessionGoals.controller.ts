import type { Request, Response } from "express";

import { getSessionGoals } from "../../services/sessionGoals/getSessionGoals.service";

export const getSessionGoalsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { sessionId, name, limit, offset, orderBy, order } = req.query;

    const sessionGoals = await getSessionGoals({
      sessionId: Number(sessionId),
      name: name as string | undefined,
      limit: limit as number | undefined,
      offset: offset as number | undefined,
      orderBy: orderBy as
        | "name"
        | "createdAt"
        | "updatedAt"
        | "status"
        | undefined,
      order: order as "ASC" | "DESC" | undefined,
    });
    return res.status(200).json(sessionGoals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
