import { Op, WhereOptions } from "sequelize";

import { SessionGoal } from "../../database/models";
import { ListSessionGoalsQuery } from "../../schemas/sessionGoal.schema";

export const getSessionGoals = async (params: ListSessionGoalsQuery) => {
  const {
    sessionId,
    name,
    limit,
    offset,
    orderBy = "createdAt",
    order = "DESC",
  } = params;

  const where: WhereOptions<SessionGoal> = {};

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  where.sessionId = sessionId;

  const sessionGoals = await SessionGoal.findAll({
    where,
    limit,
    offset,
    order: [[orderBy, order]],
  });

  return sessionGoals;
};
