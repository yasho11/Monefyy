// server/src/models/financeProfile.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import User from "./User";

class FinanceProfile extends Model {
  public id!: number;
  public user_id!: number;
  public yearly_income!: number;
  public tax_percent!: number;
  public savings_percent!: number;
  public wants_percent!: number;
  public needs_percent!: number;
  public monthly_income!: number;
  public monthly_savings!: number;
  public monthly_wants!: number;
  public monthly_needs!: number;
}

FinanceProfile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // one profile per user
      references: {
        model: User,
        key: "id",
      },
    },
    yearly_income: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tax_percent: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    savings_percent: {
      type: DataTypes.FLOAT,
      defaultValue: 20,
    },
    wants_percent: {
      type: DataTypes.FLOAT,
      defaultValue: 30,
    },
    needs_percent: {
      type: DataTypes.FLOAT,
      defaultValue: 50,
    },
    monthly_income: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    monthly_savings: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    monthly_wants: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    monthly_needs: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "finance_profiles",
    timestamps: true,
  }
);

// Define association
FinanceProfile.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default FinanceProfile;
