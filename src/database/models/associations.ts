import { Project } from "./project.model";
import { User } from "./user.model";

User.hasMany(Project, {
  foreignKey: "userId",
  sourceKey: "id",
});

Project.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
});
