import type { Request, Response } from "express";

import { createSession } from "../../services/sessions/createSession.service";

export const createSessionController = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const session = await createSession(body);
    return res.status(201).json(session);
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred while processing your request",
    });
  }
};
