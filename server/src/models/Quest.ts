// server/src/models/Quest.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Quest extends Model {
  public id!: number;
  public title!: string;
  public description?: string;
  public type!: string; // e.g., "daily", "weekly", "custom"
  public exp_reward!: number;
  public is_active!: boolean;
}

Quest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "daily",
    },
    exp_reward: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "quests",
    timestamps: true,
  }
);

export default Quest;
