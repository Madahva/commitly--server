import type { Request, Response } from "express";

import { updateUser } from "../../services/users/updateUser.service";

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const user = await updateUser(Number(id), body);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
