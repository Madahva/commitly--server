import { User } from "../../database/models/user.model";
import type { User as UserType } from "../../schemas/user.schema";

export const getAllUsersService = async (): Promise<UserType[]> => {
  const users = await User.findAll();
  return users.map((user) => user.toJSON() as UserType);
};
