/**
 * index.ts
 * ------------------------
 * This file sets up the Express application instance.
 * - Loads environment variables
 * - Configures global middlewares (CORS, JSON parser, etc.)
 * - Registers API routes
 *
 * Note: It does NOT start the server. 
 * That is handled by server.ts for easier testing and modularity.
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes (will add later)
app.get("/", (req, res) => {
  res.send("Monefyy API running 🚀");
});

export default app;
