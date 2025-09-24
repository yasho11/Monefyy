import express, { RequestHandler } from "express";
import passport from "passport";
import { body } from "express-validator";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validate"; // the middleware we discussed
import * as authController from "../controllers/authController";
import { createReferralCode } from "../controllers/referralController";
import { loginLimiter } from "../server"; 
 
const router = express.Router();

// -------------------- Auth Routes --------------------

// Register a new user
router.post(
  "/register",
  [
    body("username").isString().trim().notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("currency").isString().notEmpty().withMessage("Currency is required"),
  ],
  validateRequest,
  authController.register
);

// Login existing user
router.post(
  "/login",
  //loginLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  authController.login
);


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
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email is required")],
  validateRequest,
  authController.forgotPassword
);

// Reset password (using code sent via email)
router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("code").notEmpty().withMessage("Reset code is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  authController.resetPassword
);

// Update currency preference
router.put(
  "/currency",
  protect,
  [body("currency").isString().notEmpty().withMessage("Currency is required")],
  validateRequest,
  authController.setCurrency
);

// Edit profile (username, avatar, etc.)
router.put(
  "/edit-profile",
  protect,
  [
    body("username").optional().isString().trim(),
    body("currency").optional().isString(),
  ],
  validateRequest,
  authController.updateProfile
);

// Send verification code
router.post("/send-verification", protect, authController.sendVerification);

// Verify email
router.post(
  "/verify-email",
  protect,
  [body("code").notEmpty().withMessage("Verification code is required")],
  validateRequest,
  authController.verifyEmail
);

// Generate referral code
router.get("/generate-referral", protect, createReferralCode as RequestHandler);

//Email verified accounf

router.get("/email-verified", protect, authController.isEmailVerified);


// Check auth
router.get("/check-auth",  protect, authController.checkAuth)



//! Logout

router.get("/logout", protect, authController.logout);

export default router;
