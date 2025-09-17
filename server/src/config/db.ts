import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "monefyy-db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS || "6616",
  {
    host: process.env.DB_HOST || "postgres",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development",
  }
);

export async function connectWithRetry(maxRetries = 10, delay = 2000) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connected!");
      return sequelize;
    } catch (err) {
      attempt++;
      console.log(`DB not ready, retrying (${attempt}/${maxRetries}) in ${delay / 1000}s...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Unable to connect to DB after multiple attempts");
}

export default sequelize;
