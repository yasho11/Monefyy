import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class UserPushSubscription extends Model {
  public id!: number;
  public user_id!: number;
  public endpoint!: string;
  public keys_p256dh!: string;
  public keys_auth!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

UserPushSubscription.init(
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
    endpoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keys_p256dh: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keys_auth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "user_push_subscriptions",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);

export default UserPushSubscription;
