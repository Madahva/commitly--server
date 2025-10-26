import type { Request, Response } from "express";

import { getAllProjects } from "../../services/projects/getAllProjects.service";

export const getAllProjectsController = async (req: Request, res: Response) => {
  try {
    const { userId, isActive, trackTime, name, limit, offset, orderBy, order } =
      req.query;

    const projects = await getAllProjects({
      userId: Number(userId),
      isActive: isActive as boolean | undefined,
      trackTime: trackTime as boolean | undefined,
      name: name as string | undefined,
      limit: limit as number | undefined,
      offset: offset as number | undefined,
      orderBy: orderBy as "name" | "createdAt" | "updatedAt" | undefined,
      order: order as "ASC" | "DESC" | undefined,
    });

    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
