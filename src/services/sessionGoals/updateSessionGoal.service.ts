import { SessionGoal } from "../../database/models";
import type { UpdateSessionGoal as UpdateSessionGoalType } from "../../schemas/sessionGoal.schema";

export const updateSessionGoal = async (
  id: number,
  sessionGoalData: UpdateSessionGoalType
) => {
  const result = await SessionGoal.update(sessionGoalData, {
    where: { id },
    returning: true,
  });
  return result;
};
