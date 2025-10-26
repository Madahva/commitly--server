import { Project } from "../../database/models";

export const getAllProjects = async (userId: number) => {
  const projects = await Project.findAll({ where: { userId } });
  return projects;
};
