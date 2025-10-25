import { Project } from "../../database/models";
import type { Project as projectType } from "../../schemas/project.schema";

export const createProject = async (projectData: projectType) => {
  const newProject = await Project.create(projectData);
  return newProject;
};
