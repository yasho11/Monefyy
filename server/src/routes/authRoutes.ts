import express from "express";
import { register, login, getMe, googleCallback } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";
import passport from "passport";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);


// Start Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback // our controller to send JWT to client
);
export default router;
