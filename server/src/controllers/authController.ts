import { Request, Response } from "express";
import dotenv from "dotenv";
import validator from "validator";

import * as authService from "../services/authService";
import { checkIn } from "./gamifyController";
import { syncAllQuestsToUser, updateAllUserQuestProgress } from "../services/questService";

dotenv.config();

interface AuthRequest extends Request {
  user?: any;
}

// @desc   Register new user
// @route  POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  const { username, email, password, currency } = req.body;

  if (!username || !email || !password || !currency) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    });
  }

  try {
    const user = await authService.registerUser({ username, email, password, currency });
    await syncAllQuestsToUser(user.id);

    res.status(201).json(user);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message || "Registration failed" });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Please provide all fields" });

  try {
    const user = await authService.loginUser(email, password);

    // Run streak/check-in logic
    const streakResult = await checkIn(user, res);

    await syncAllQuestsToUser(user.id);
    await updateAllUserQuestProgress(user.id);

    res.json({
      ...user,
      streak: streakResult?.streak ?? 0,
      expGained: streakResult?.expGained ?? 0,
      message: streakResult?.message ?? "",
      lastActive: user.last_active_date,
    });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message || "Login failed" });
  }
};

// @desc   Get current user
// @route  GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  await updateAllUserQuestProgress(req.user.id);
  res.json(req.user);
};

// @desc   Handle Google OAuth callback
// @route  GET /api/auth/google/callback
export const googleCallback = async (req: Request, res: Response) => {
  const user = (req.user as any)?.user;
  const token = (req.user as any)?.token;

  if (!user || !token) {
    return res.status(400).json({ message: "Google login failed" });
  }

  await syncAllQuestsToUser(user.id);
  await updateAllUserQuestProgress(user.id);

  return res.status(200).json({
    id: user.id,
    username: user.username,
    email: user.email,
    token,
  });
};

// @desc   Send email verification code
// @route  POST /api/auth/send-verification
export const sendVerification = async (req: AuthRequest, res: Response) => {
  try {
    const result = await authService.sendVerificationCode(req.user.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// @desc   Verify email
// @route  POST /api/auth/verify-email
export const verifyEmail = async (req: AuthRequest, res: Response) => {
  const { code } = req.body;
  try {
    const result = await authService.verifyEmail(req.user.id, code);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// @desc   Send reset password code
// @route  POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const result = await authService.sendResetPasswordCode(email);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// @desc   Reset password
// @route  POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  try {
    const result = await authService.resetPassword(email, code, newPassword);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// @desc   Update profile
// @route  PUT /api/auth/profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { username, currency } = req.body;
  try {
    const updated = await authService.updateProfile(req.user.id, { username, currency });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// @desc   Update currency
// @route  PUT /api/auth/currency
export const setCurrency = async (req: AuthRequest, res: Response) => {
  const { currency } = req.body;
  try {
    const result = await authService.setCurrency(req.user.id, currency);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
