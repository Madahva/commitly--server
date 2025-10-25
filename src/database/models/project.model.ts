import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const Project = sequelize.define(
  "Project",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    color: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i,
          msg: "Color must be a valid hex color (e.g., #FF5733 or #F57)",
        },
      },
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
