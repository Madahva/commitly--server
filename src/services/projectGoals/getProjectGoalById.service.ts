import { ProjectGoal } from "../../database/models";

export const getProjectGoalById = async (id: number) => {
  return await ProjectGoal.findByPk(id);
};
