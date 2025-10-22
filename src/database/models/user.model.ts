import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const User = sequelize.define(
  "User",
  {
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    picture: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sub: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^auth0\|[a-zA-Z0-9]+$/,
      },
    },
  },
  {
    updatedAt: "updated_at",
    createdAt: "created_at",
  },
);
