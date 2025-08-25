import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User";
import validator from "validator";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { generateToken } from "../utils/jwt";
import { checkIn } from "./gamifyController";

dotenv.config();

interface AuthRequest extends Request {
  user?: any;
}



// @desc   Register new user
// @route  POST /api/auth/register

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Check required fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate password strength
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
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({ username, email, password_hash });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (err: any) {
    console.error(err);

    // Handle Sequelize unique constraint error just in case
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email already registered" });
    }

    res.status(500).json({ message: "Server error" });
  }
};


// @desc   Login user
// @route  POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Please provide all fields" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.password_hash || typeof user.password_hash !== "string") {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Call check-in logic after successful login
    await checkIn(req as AuthRequest, res);

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// @desc   Get current user
// @route  GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  res.json(req.user);
};

// @desc   Handle Google OAuth callback and return user info + JWT
// @route  GET /api/auth/google/callback

export const googleCallback = (req: Request, res: Response) => {
  // Passport attaches user + token to req.user
  const user = (req.user as any)?.user;
  const token = (req.user as any)?.token;

  if (!user || !token) {
    return res.status(400).json({ message: "Google login failed" });
  }

  // Send JWT to client
  return res.status(200).json({
    id: user.id,
    username: user.username,
    email: user.email,
    token,
  });
};