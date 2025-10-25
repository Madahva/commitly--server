import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const Project = sequelize.define(
  "Project",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    color: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    track_time: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);
