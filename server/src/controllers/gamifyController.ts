import { Response } from "express";
import { AuthRequest } from "./transactionController"; // or your shared Auth type
import { updateStreak } from "../services/streakService";
import { addExperience as addExp } from "../services/expService";

// Handle streak check-in
export const checkIn = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await updateStreak(userId);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ message: "Error updating streak", error: err.message });
  }
};

// Handle manual EXP awarding (e.g. completing goals)
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
