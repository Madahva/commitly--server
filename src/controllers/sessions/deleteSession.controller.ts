import type { Request, Response } from "express";

import { deleteSession } from "../../services/sessions/deleteSession.service";

export const deleteSessionController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCount = await deleteSession(Number(id));

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
