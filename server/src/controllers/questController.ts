// server/src/controllers/questController.ts
import { Request, Response } from "express";
import {
  assignQuestToUser,
  getUserQuests,
  updateQuestProgress,
  completeQuest,
  getAllActiveQuests,
} from "../services/questService";


interface AuthRequest extends Request {
  user?: any;
}

/**
 * Assign a quest to a user
 * POST /api/quests/assign
 */
export const assignQuest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { questId } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!questId) return res.status(400).json({ message: "Quest ID required" });

    const userQuest = await assignQuestToUser(userId, questId);
    res.json({ message: "Quest assigned!", quest: userQuest });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get all quests for a user
 * GET /api/quests/user
 */
export const fetchUserQuests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const quests = await getUserQuests(userId);
    res.json({ quests });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update quest progress
 * PUT /api/quests/progress
 */
export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { questId, progressIncrement } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!questId || typeof progressIncrement !== "number") {
      return res.status(400).json({ message: "Invalid input" });
    }

    const updatedQuest = await updateQuestProgress(userId, questId, progressIncrement);
    res.json({ message: "Quest progress updated!", quest: updatedQuest });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Complete quest manually
 * POST /api/quests/complete
 */
export const completeUserQuest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { questId } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!questId) return res.status(400).json({ message: "Quest ID required" });

    const completedQuest = await completeQuest(userId, questId);
    res.json({ message: "Quest completed!", quest: completedQuest });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Fetch all active quests
 * GET /api/quests/active
 */
export const fetchActiveQuests = async (_req: Request, res: Response) => {
  try {
    const quests = await getAllActiveQuests();
    res.json({ quests });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};