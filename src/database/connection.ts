import { Sequelize } from "sequelize-typescript";

import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, NODE_ENV } from "../config";
import { User } from "./models/user.model";
import { Project } from "./models/project.model";
import { Session } from "./models/session.model";

export const sequelize = new Sequelize({
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  dialect: "postgres",
  logging: NODE_ENV === "development" ? console.log : false,
  models: [User, Project, Session],
});
