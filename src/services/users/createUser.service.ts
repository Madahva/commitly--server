import { User } from "../../database/models/user.model";
import type { User as UserType } from "../../schemas/user.schema";

export const createUser = async (userData: UserType) => {
  const newUser = await User.findOrCreate({
    where: { email: userData.email },
    defaults: userData,
  });
  return newUser;
};
