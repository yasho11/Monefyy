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
  public lifetime_exp!: number;
  public streak_count!: number;
  public last_active_date?: Date;

  // NEW
  public currency!: string;
  public avatar_url!: string;

  public is_verified!: boolean;
  public verification_code?: string;
  public reset_code?: string;
  public reset_code_expires?: Date;
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

    // 🔥 NEW FIELDS
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "USD",
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verification_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_code_expires: {
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
