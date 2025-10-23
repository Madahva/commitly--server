import type { Request, Response } from "express";

import { deleteUser } from "../../services/users/deleteUser.service";

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteUser(Number(id));

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
