import { Op, WhereOptions } from "sequelize";

import { ProjectGoal } from "../../database/models";
import { ListProjectGoalsQuery } from "../../schemas/projectGoal.schema";

export const getProjectGoals = async (params: ListProjectGoalsQuery) => {
  const {
    projectId,
    name,
    limit,
    offset,
    orderBy = "createdAt",
    order = "DESC",
  } = params;

  const where: WhereOptions<ProjectGoal> = {};

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  where.projectId = projectId;

  const projectGoals = await ProjectGoal.findAll({
    where,
    limit,
    offset,
    order: [[orderBy, order]],
  });

  return projectGoals;
};
