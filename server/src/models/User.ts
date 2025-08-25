import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password_hash?: string;
  public google_id?: string;
  public provider!: string;
  public subscription!: string;
  public tier!: string;
  public level!: number;
  public exp_points!: number;
  public lifetime_exp!: number;   // NEW
  public streak_count!: number;
  public last_active_date?: Date; // NEW
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    google_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    provider: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "local",
    },
    subscription: {
      type: DataTypes.STRING(20),
      defaultValue: "standard",
    },
    tier: {
      type: DataTypes.STRING(20),
      defaultValue: "novice",
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    exp_points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lifetime_exp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    streak_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_active_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

export default User;
