import { User } from "../../database/models/user.model";

export const deleteUser = async (id: number) => {
  return await User.destroy({ where: { id } });
};
