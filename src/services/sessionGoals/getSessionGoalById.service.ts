import { SessionGoal } from "../../database/models";

export const getSessionGoalById = async (id: number) => {
  return await SessionGoal.findByPk(id);
};
