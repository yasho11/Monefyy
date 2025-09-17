/**
 * server.ts
 * ------------------------
 * Entry point of the application
 * - Starts Express server
 * - Waits for PostgreSQL to be ready with retry logic
 */

import dotenv from "dotenv";
dotenv.config(); // Load .env first

import sequelize from "./config/db";
import app from "./index";
import authRoutes from "./routes/authRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import gamifyRoutes from "./routes/gamifyRoutes";
import questRoutes from "./routes/questRoutes";
import goalRoutes from "./routes/goalRoutes";
import passport from "./config/passport"; 

console.log("🔹 server.ts loaded, starting server...");

// Middleware & Routes
app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/gamify", gamifyRoutes);
app.use("/api/quests", questRoutes);
app.use("/api/goals", goalRoutes);

const PORT = process.env.PORT || 5000;

/**
 * Helper function: connect to DB with retries
 */
async function connectWithRetry(maxRetries = 10, delay = 2000) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connected successfully");

      await sequelize.sync({ alter: true }); // sync tables
      console.log("✅ All models were synchronized");
      return true;
    } catch (err) {
      attempt++;
      console.log(`⚠️ DB not ready, retrying (${attempt}/${maxRetries}) in ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }

  throw new Error("❌ Unable to connect to DB after multiple attempts");
}

/**
 * Start the server
 */
(async () => {
  try {
    await connectWithRetry(); // wait for DB
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error(err);
    process.exit(1); // exit process if DB never becomes available
  }
})();
