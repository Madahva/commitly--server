import { SessionGoal } from "../../database/models";

export const deleteSessionGoal = async (id: number) => {
  return await SessionGoal.destroy({ where: { id } });
};
