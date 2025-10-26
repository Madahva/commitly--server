import type { Request, Response } from "express";

import { updateSession } from "../../services/sessions/updateSession.service";

export const updateSessionController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const [affectedCount, updatedSessions] = await updateSession(
      Number(id),
      body
    );

    if (affectedCount === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json(updatedSessions[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
