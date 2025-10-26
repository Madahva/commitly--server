import type { Request, Response } from "express";

import { getSessionById } from "../../services/sessions/getSession.service";

export const getSessionController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = await getSessionById(Number(id));

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json(session);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
