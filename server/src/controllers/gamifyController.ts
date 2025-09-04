import { Response, Request } from "express";
import { AuthRequest } from "./transactionController"; // or your shared Auth type
import { updateStreak } from "../services/streakService";
import { addExperience as addExp } from "../services/expService";
import User from "../models/User";
import { getLeaderboard } from "../services/gamifyService";
// Handle streak check-in
// server/src/controllers/gamifyController.ts

//! To-do : Future:
//!  1. Implement Badge system
//!  2. Implement Daily Rewards

interface SUser{
  id: Number;

}

export const checkIn = async (user: SUser, res: Response) => {
  try {
    const userId = Number(user.id); // or req.user.id if using auth
    const result = await updateStreak(userId);
    return result;
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


// User awards themselves EXP (e.g. after completing tasks)
export const awardExp = async (req: AuthRequest, res: Response) => {
  try {
    const { points } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!points || typeof points !== "number") {
      return res.status(400).json({ message: "Invalid points" });
    }

    const updatedUser = await addExp(userId, points);

    res.json({
      message: `Awarded ${points} EXP`,
      user: updatedUser,
    });
  } catch (err: any) {
    res.status(500).json({ message: "Error awarding EXP", error: err.message });
  }
};


export const giveExp = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const { exp } = req.body;

    if (!exp || typeof exp !== "number") {
      return res.status(400).json({ message: "Invalid EXP amount" });
    }

    const updatedUser = await addExp(userId, exp);
    res.json({
      message: `Added ${exp} EXP`,
      level: updatedUser.level,
      current_exp: updatedUser.exp_points,
      lifetime_exp: updatedUser.lifetime_exp,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};



export const leaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id; // assuming protect middleware adds req.user
    const limit = Number(req.query.limit) || 50;

    if(!userId) return res.status(401).json({message: "Unauthorized"});

    //Fetch Leaderboard
    const board = await getLeaderboard(userId, limit);
    res.json({ leaderboard: board });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};