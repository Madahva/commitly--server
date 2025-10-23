import { Sequelize } from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, NODE_ENV } from "../config";
console.log({ DB_NAME, DB_USER, DB_PASSWORD, DB_HOST });

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  logging: NODE_ENV === "development" ? console.log : false,
});
