import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";

import { Project } from "./project.model";

@Table({
  tableName: "Users",
  timestamps: true,
  underscored: true,
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nickname!: string;

  @Column({
    type: DataType.STRING,
  })
  name?: string;

  @Column({
    type: DataType.STRING,
    validate: {
      isUrl: true,
    },
  })
  picture?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  emailVerified!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^auth0\|[a-zA-Z0-9]+$/,
    },
  })
  sub!: string;

  @HasMany(() => Project)
  projects?: Project[];
}
