// server/src/models/Quest.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Quest extends Model {
  public id!: number;
  public title!: string;
  public description?: string;
  public type!: string;         // e.g., "daily", "weekly", "streak", "exp", "custom"
  public progress_field?: string; // User field to track progress: "streak_count", "lifetime_exp", etc.
  public target?: number;       // The target value to complete the quest
  public exp_reward!: number;   // EXP awarded on completion
  public is_active!: boolean; // Whether the quest is active
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
    progress_field: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "User field to track quest progress",
    },
    target: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Target value to complete quest",
    },
    exp_reward: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    sequelize,
    tableName: "quests",
    timestamps: true,
  }
);

export default Quest;
