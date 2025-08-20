/**
 * db.ts
 * ------------------------
 * Sets up Sequelize connection to PostgreSQL
 * postgres superpass= 6616
 */

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "monefyy",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS || "password",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false, // set true to see SQL queries
  }
);

export default sequelize;
