import { Request, Response } from "express";
import z from "zod";

import { createUser } from "../../services/users/createUser.service";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const [user, created] = await createUser(body);
    return res.status(created ? 201 : 200).json(user);
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return res.status(500).json({
        message: error.message,
      });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
