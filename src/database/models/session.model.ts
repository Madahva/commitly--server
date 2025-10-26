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
  tableName: "Sessions",
  timestamps: true,
  underscored: true,
})
export class Session extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  note!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  durationMinutes!: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  projectId!: number;

  @BelongsTo(() => Project)
  project?: Project;
}
