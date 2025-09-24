/**
 * authMiddleware.ts
 * --------------------------------
 * Middleware for protecting routes in Monefyy
 * - Supports JWT via Authorization header (Bearer) OR cookies
 * - Attaches user object to req.user
 * - Provides admin-only route protection
 */

import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

interface DecodedToken extends JwtPayload {
  id: number; // assuming your JWT payload includes user ID
}

export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Protect middleware (for authenticated users)
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // 1️⃣ Check for Bearer token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ Fallback: Check cookies
    if (!token && req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    // 3️⃣ No token found
    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, token missing" });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    // 5️⃣ Find user by decoded.id (exclude sensitive fields)
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (err) {
    console.error("❌ Auth error:", err);
    return res
      .status(401)
      .json({ message: "Not authorized, invalid or expired token" });
  }
};

/**
 * Admin-only route protection
 */
export const adminProtect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.UserType === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied, admin only" });
};
