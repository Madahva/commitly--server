import { ProjectGoal } from "../../database/models";

export const deleteProjectGoal = async (id: number) => {
  return await ProjectGoal.destroy({ where: { id } });
};
