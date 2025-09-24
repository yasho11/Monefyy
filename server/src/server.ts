/**
 * server.ts
 * ------------------------
 * Express application setup for Monefyy Beta-1
 * - Loads environment variables
 * - Configures CORS with trusted origins
 * - Configures JSON parser
 * - Sets up login rate-limiter
 * - Registers API routes
 */

//@ts-ignore
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import cookieParser from 'cookie-parser';


dotenv.config({path: '.env.development'});
console.log("🔹 index.ts loaded, starting index...");

const app = express();

// -------------------
// CORS Restriction
// -------------------
const allowedOrigins = [
  "http://localhost:5173",     // local frontend
  "https://monefyy.com",       // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: This origin is not allowed"));
      }
    },
    credentials: true, // allow cookies, auth headers
  })
);

// -------------------
// Global Middlewares
// -------------------
app.use(express.json());
app.use(cookieParser());

// ----------------
// NODE ENVIROMENT
// ----------------

const NODE_ENV = process.env.NODE_ENV;
console.log("Current NODE_ENV:", NODE_ENV);

// -------------------
// Login Rate Limiter
// -------------------
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                   // max 5 login attempts per IP
  message: {
    message: "Too many login attempts. Try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// -------------------
// Routes (Placeholders for Beta-1)
// -------------------
app.get("/", (req, res) => {
  res.send("Monefyy API running !Hell yeah");
});


// Example: other routes would be imported normally
// import authRoutes from "./routes/authRoutes";
// app.use("/api/auth", authRoutes);

export default app;
