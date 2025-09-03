import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Goal extends Model {
  public id!: number;
  public userId!: number;
  public title!: string;
  public description?: string;
  public priority!: "low" | "medium" | "high";
  public isCompleted!: boolean;
  public exp_reward!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Goal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      allowNull: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    exp_reward: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "goals",
    timestamps: true,
  }
);

export default Goal;
