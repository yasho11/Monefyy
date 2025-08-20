/**
 * server.ts
 * ------------------------
 * This is the entry point of the application.
 * - Imports the configured Express app from index.ts
 * - Starts the server on the defined PORT
 * 
 * Keeping server startup separate makes it easier to:
 * - Run automated tests without booting a server
 * - Reuse the app instance in different contexts
 */
import sequelize from "./config/db";
import app from "./index";
import authRoutes from "./routes/authRoutes";
import financeRoutes from "./routes/financeRoutes";
import passport from "./config/passport"; // Initialize passport strategies

const PORT = process.env.PORT || 5000;

app.use(passport.initialize());

app.use("/api/auth", authRoutes);


app.use("/api/finance", financeRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync({ alter: true }); // sync tables (use { force: true } for reset)
    console.log("✅ All models were synchronized");

    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Unable to connect to DB:", err);
  }
})();
