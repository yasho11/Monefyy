import express, { RequestHandler } from "express";
import passport from "passport";
import { protect } from "../middlewares/authMiddleware";
import * as authController from "../controllers/authController";
import { createReferralCode } from "../controllers/referralController";

const router = express.Router();

// -------------------- Auth Routes --------------------

// Register a new user
router.post("/register", authController.register);

// Login existing user
router.post("/login", authController.login);

// Get current user profile
router.get("/me", protect, authController.getMe);

// Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback
);

// -------------------- Extra Features --------------------

// Forgot password (send reset code)
router.post("/forgot-password", authController.forgotPassword);

// Reset password (using code sent via email)
router.post("/reset-password", authController.resetPassword);

// Update currency preference
router.put("/currency", protect, authController.setCurrency);

// Edit profile (username, avatar, etc.)
router.put("/edit-profile", protect, authController.updateProfile);


router.post("/send-verification", protect, authController.sendVerification);

router.post("/verify-email", protect, authController.verifyEmail);

router.get("/generate-referral", protect, createReferralCode as RequestHandler);

export default router;
