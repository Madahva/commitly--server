import { Project } from "../../database/models";

export const getProjectById = async (id: number) => {
  const project = await Project.findByPk(id);
  return project;
};
