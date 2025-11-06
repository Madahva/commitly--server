import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

import { Project } from "./project.model";

@Table({
  tableName: "ProjectGoals",
  timestamps: true,
  underscored: true,
})
export class ProjectGoal extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.ENUM("pending", "on progress", "completed"),
    allowNull: false,
    defaultValue: "pending",
  })
  status!: "pending" | "on progress" | "completed";

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  projectId!: number;

  @BelongsTo(() => Project)
  project?: Project;
}
