import { Request, Response } from "express";
import Goal from "../models/Goal";
import { AuthRequest } from "./transactionController";
import { addExperience as addExp } from "../services/expService";

const getExpByPriority = (priority: string): number => {
  switch (priority) {
    case "low": return 15;
    case "medium": return 40;
    case "high": return 80;
    default: return 10;
  }
};

// Create Goal
export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority } = req.body;
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }
    const userId = req.user.id; // assuming auth middleware adds user

    const exp_reward = getExpByPriority(priority);

    const goal = await Goal.create({
      userId,
      title,
      description,
      priority,
      exp_reward,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: "Failed to create goal" });
  }
};

// Get All Goals
export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }
    const userId = req.user.id; // assuming auth middleware adds user
    const goals = await Goal.findAll({ where: { userId } });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

// Update Goal
export const updateGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, priority } = req.body;

    const goal = await Goal.findByPk(id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    goal.title = title || goal.title;
    goal.description = description || goal.description;
    goal.priority = priority || goal.priority;
    goal.exp_reward = getExpByPriority(goal.priority);

    await goal.save();
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: "Failed to update goal" });
  }
};

// Mark Complete (Manual Check)
export const completeGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
        if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }
    const userId = req.user.id; // assuming auth middleware adds user
    const goal = await Goal.findByPk(id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    if (goal.userId !== userId) return res.status(403).json({ error: "Not your goal" });
    if (goal.isCompleted) return res.status(400).json({ error: "Already completed" });

    goal.isCompleted = true;
    await goal.save();

    // ⬇️ Add EXP reward
    const updatedUser = await addExp(userId, goal.exp_reward);

    res.json({
      message: "Goal completed 🎉",
      expGained: goal.exp_reward,
      newTotalExp: updatedUser.exp_points, // assuming user model has exp
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to complete goal" });
  }
};

// Delete Goal
export const deleteGoal = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findByPk(id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    await goal.destroy();
    res.json({ message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete goal" });
  }
};
