import { ProjectGoal } from "../../database/models";
import type { CreateProjectGoal as createProjectGoalType } from "../../schemas/projectGoal.schema";

export const createProjectGoal = async (
  projectGoalData: createProjectGoalType
) => {
  return await ProjectGoal.create(projectGoalData);
};
