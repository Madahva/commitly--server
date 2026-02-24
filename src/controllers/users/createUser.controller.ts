import type { Request, Response } from "express";

import { createUser } from "../../services/users/createUser.service";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const [user, created] = await createUser(body);
    return res.status(created ? 201 : 200).json(user);
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred while processing your request",
    });
  }
};
