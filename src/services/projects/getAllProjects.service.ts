import { Op, WhereOptions } from "sequelize";

import { Project } from "../../database/models";

interface GetAllProjectsParams {
  userId: number;
  isActive?: boolean;
  trackTime?: boolean;
  name?: string;
  limit?: number;
  offset?: number;
  orderBy?: "name" | "createdAt" | "updatedAt";
  order?: "ASC" | "DESC";
}

export const getAllProjects = async (params: GetAllProjectsParams) => {
  const {
    userId,
    isActive,
    trackTime,
    name,
    limit,
    offset,
    orderBy = "createdAt",
    order = "DESC",
  } = params;

  const where: WhereOptions<Project> = { userId };

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  if (trackTime !== undefined) {
    where.trackTime = trackTime;
  }

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  const projects = await Project.findAll({
    where,
    limit,
    offset,
    order: [[orderBy, order]],
  });

  return projects;
};
