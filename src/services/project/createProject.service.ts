import { Project } from "../../database/models";
import type { Project as projectType } from "../../schemas/project.schema";

export const createProject = async (projectData: projectType) => {
  const newProject = await Project.findOrCreate({
    where: { name: projectData.name },
    defaults: projectData,
  });
  return newProject;
};
