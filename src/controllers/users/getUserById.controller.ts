import type { Request, Response } from "express";

import { getUserById } from "../../services/users/getUserById.service";

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserById(Number(id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred while processing your request",
    });
  }
};
