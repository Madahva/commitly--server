import { Op, WhereOptions } from "sequelize";

import { Session } from "../../database/models";

interface GetProjectSessionsParams {
  projectId: number;
  name?: string;
  limit?: number;
  offset?: number;
  orderBy?: "name" | "createdAt" | "updatedAt" | "durationMinutes";
  order?: "ASC" | "DESC";
}

export const getProjectSessions = async (params: GetProjectSessionsParams) => {
  const {
    projectId,
    name,
    limit,
    offset,
    orderBy = "createdAt",
    order = "DESC",
  } = params;

  const where: WhereOptions<Session> = { projectId };

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  const sessions = await Session.findAll({
    where,
    limit,
    offset,
    order: [[orderBy, order]],
  });

  return sessions;
};
