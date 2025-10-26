import { Op, WhereOptions } from "sequelize";

import { Session } from "../../database/models";
import { Project } from "../../database/models";

interface GetUserSessionsParams {
  userId: number;
  name?: string;
  limit?: number;
  offset?: number;
  orderBy?: "name" | "createdAt" | "updatedAt" | "durationMinutes";
  order?: "ASC" | "DESC";
}

export const getUserSessions = async (params: GetUserSessionsParams) => {
  const {
    userId,
    name,
    limit,
    offset,
    orderBy = "createdAt",
    order = "DESC",
  } = params;

  const sessionWhere: WhereOptions<Session> = {};

  if (name) {
    sessionWhere.name = { [Op.iLike]: `%${name}%` };
  }

  const sessions = await Session.findAll({
    where: sessionWhere,
    include: [
      {
        model: Project,
        where: { userId },
        attributes: [],
      },
    ],
    limit,
    offset,
    order: [[orderBy, order]],
  });

  return sessions;
};
