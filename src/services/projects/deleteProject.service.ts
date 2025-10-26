import { Project } from "../../database/models";

export const deleteProject = async (id: number) => {
  const deletedCount = await Project.destroy({
    where: { id },
  });
  return deletedCount;
};
