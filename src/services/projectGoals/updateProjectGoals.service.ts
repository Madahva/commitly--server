import { ProjectGoal } from "../../database/models";
import type { UpdateProjectGoal as UpdateProjectGoalType } from "../../schemas/projectGoal.schema";

export const updateProjectGoals = async (
  id: number,
  projectGoalData: UpdateProjectGoalType
) => {
  const result = await ProjectGoal.update(projectGoalData, {
    where: { id },
    returning: true,
  });
  return result;
};
