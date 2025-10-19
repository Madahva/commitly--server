import { Request, Response } from "express";
import z from "zod";

import { userSchema } from "../../schemas/user.schema";
import { getAllUsersService } from "../../services/users/getAllUsers.service";
import type { User } from "../../schemas/user.schema";

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users: User[] = await getAllUsersService();
    const result = z.array(userSchema).parse(users);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(500).json({
        message: error.message,
      });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
