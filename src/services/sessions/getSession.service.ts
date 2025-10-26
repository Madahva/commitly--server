import { Session } from "../../database/models";

export const getSessionById = async (id: number) => {
  const session = await Session.findByPk(id);
  return session;
};
