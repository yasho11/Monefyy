import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // Check for Bearer token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Find user by id (exclude password)
    const user = await User.findByPk(decoded.id, { attributes: { exclude: ["password_hash"] } });
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};


export const adminProtect = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.UserType === "admin") {
    return next();
  } else {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
};