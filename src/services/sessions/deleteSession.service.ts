import { Session } from "../../database/models";

export const deleteSession = async (id: number) => {
  const deletedCount = await Session.destroy({
    where: { id },
  });
  return deletedCount;
};
