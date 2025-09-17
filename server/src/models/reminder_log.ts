import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class ReminderLog extends Model {
  public id!: number;
  public user_id!: number;
  public type!: "streak" | "quest" | "goal" | "transaction";
  public sent_at!: Date;
}

ReminderLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("streak", "quest", "goal", "transaction"),
      allowNull: false,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "reminder_log",
    timestamps: false,
  }
);

export default ReminderLog;
