import type { Request, Response } from "express";

import { getAllUsersService } from "../../services/users/getAllUsers.service";
import type { User } from "../../schemas/user.schema";

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users: User[] = await getAllUsersService();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
