import { Session } from "../../database/models";
import type { CreateSession as sessionType } from "../../schemas/session.schema";

export const createSession = async (sessionData: sessionType) => {
  const newSession = await Session.create(sessionData);
  return newSession;
};
