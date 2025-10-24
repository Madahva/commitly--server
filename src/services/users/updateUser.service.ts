import { User } from "../../database/models/user.model";
import type { User as UserType } from "../../schemas/user.schema";

export const updateUser = async (id: number, userData: Partial<UserType>) => {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  await user.update(userData);
  return user;
};
