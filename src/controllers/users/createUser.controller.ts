import { Request, Response } from "express";

export const createUserController = (req: Request, res: Response) => {
  try {
    const { body } = req;

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {}
};
