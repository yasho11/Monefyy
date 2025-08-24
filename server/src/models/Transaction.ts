// server/src/models/transaction.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./User";

class Transaction extends Model {
  public id!: number;
  public userId!: number;
  public type!: "income" | "expense";
  public category!: "savings" | "wants" | "needs";
  public tag?: string;
  public amount!: number;
  public description?: string;
  public date!: Date;
  public recurring!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Transaction.init(
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
      onDelete: "CASCADE",
    },
    type: {
      type: DataTypes.ENUM("income", "expense"),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("savings", "wants", "needs"),
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    recurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "transactions",
    timestamps: true,
  }
);

// Associate Transaction with User
Transaction.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Transaction, { foreignKey: "userId", as: "transactions" });

export default Transaction;
