import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

import { User } from "./user.model";

@Table({
  tableName: "Projects",
  timestamps: true,
  underscored: true,
})
export class Project extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
  })
  description?: string;

  @Column({
    type: DataType.STRING,
    validate: {
      is: {
        args: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i,
        msg: "Color must be a valid hex color (e.g., #FF5733 or #F57)",
      },
    },
  })
  color?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  track_time!: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user?: User;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;
}
