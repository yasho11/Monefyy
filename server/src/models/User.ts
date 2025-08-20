import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password_hash?: string; // optional for Google users
  public google_id?: string;     // optional, only for Google users
  public provider!: string;      // "local" or "google"
  public subscription!: string;
  public tier!: string;
  public level!: number;
  public exp_points!: number;
  public streak_count!: number;
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
      allowNull: true, // optional for Google users
    },
    google_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    provider: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "local", // "local" for normal registration, "google" for Google login
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
    streak_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

export default User;
