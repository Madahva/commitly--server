import { SessionGoal } from "../../database/models";
import type { CreateSessionGoal } from "../../schemas/sessionGoal.schema";

export const createSessionGoal = async (SessionGoalData: CreateSessionGoal) => {
  return await SessionGoal.create(SessionGoalData);
};
