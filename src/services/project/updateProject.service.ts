import { Project } from "../../database/models";
import type { UpdateProject as UpdateProjectType } from "../../schemas/project.schema";

export const updateProject = async (
  id: number,
  projectData: UpdateProjectType
) => {
  const result = await Project.update(projectData, {
    where: { id },
    returning: true,
  });
  return result;
};
