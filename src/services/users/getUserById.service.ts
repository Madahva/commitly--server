import { User } from "../../database/models/user.model";

export const getUserById = async (id: number) => {
  const user = await User.findByPk(id);
  return user;
};
