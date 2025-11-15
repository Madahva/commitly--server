import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

import { Session } from "./session.model";

@Table({
  tableName: "SessionGoals",
  timestamps: true,
  underscored: true,
})
export class SessionGoal extends Model {
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

  @ForeignKey(() => Session)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sessionId!: number;

  @BelongsTo(() => Session)
  session?: Session;
}
