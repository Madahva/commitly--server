import { Session } from "../../database/models";
import type { UpdateSession as UpdateSessionType } from "../../schemas/session.schema";

export const updateSession = async (
  id: number,
  sessionData: UpdateSessionType
) => {
  const result = await Session.update(sessionData, {
    where: { id },
    returning: true,
  });
  return result;
};
