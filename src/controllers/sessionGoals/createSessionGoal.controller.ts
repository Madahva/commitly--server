import type { Request, Response } from "express";

import { createSessionGoal } from "../../services/sessionGoals/createSessionGoal.service";

export const createSessionGoalController = async (
  req: Request,
  res: Response
) => {
  try {
    const { body } = req;
    const newSessionGoal = await createSessionGoal(body);

    return res.status(201).json(newSessionGoal);
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred while processing your request",
    });
  }
};
