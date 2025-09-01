// server/src/models/UserQuest.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./User";
import Quest from "./Quest";

class UserQuest extends Model {
  public id!: number;
  public userId!: number;
  public questId!: number;
  public progress!: number; // for tracking completion % if needed
  public completed!: boolean;
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
      defaultValue: 0,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
