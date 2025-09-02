// server/src/models/UserQuest.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./User";
import Quest from "./Quest";

class UserQuest extends Model {
  public id!: number;
  public userId!: number;
  public questId!: number;
  public progress!: number | null;  // nullable for quests that are boolean
  public completed!: boolean;
  public assignedAt!: Date; // Timestamp when quest was assigned
  public completedAt!: Date | null; // nullable until completed
}

UserQuest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    questId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Quest, key: "id" },
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "Numeric progress for quests (optional)",
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    assignedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Timestamp when quest was completed",
    },
  },
  {
    sequelize,
    tableName: "user_quests",
    timestamps: true,
  }
);

// Associations
UserQuest.belongsTo(User, { foreignKey: "userId" });
UserQuest.belongsTo(Quest, { foreignKey: "questId" });
User.hasMany(UserQuest, { foreignKey: "userId" });
Quest.hasMany(UserQuest, { foreignKey: "questId" });

export default UserQuest;
