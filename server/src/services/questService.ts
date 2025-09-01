// server/src/services/questService.ts
import UserQuest from "../models/UserQuest";
import Quest from "../models/Quest";
import User from "../models/User";
import { addExperience } from "./expService";

/**
 * Assign a quest to a user
 */
export const assignQuestToUser = async (userId: number, questId: number) => {
  // Check if user already has this quest
  const existing = await UserQuest.findOne({ where: { userId, questId } });
  if (existing) return existing;

  const userQuest = await UserQuest.create({ userId, questId, progress: 0, completed: false });
  return userQuest;
};

/**
 * Fetch all quests for a user
 */
export const getUserQuests = async (userId: number) => {
  const quests = await UserQuest.findAll({
    where: { userId },
    include: [{ model: Quest }],
  });
  return quests;
};

/**
 * Update progress of a user's quest
 */
export const updateQuestProgress = async (userId: number, questId: number, progressIncrement: number) => {
  const userQuest = await UserQuest.findOne({ where: { userId, questId } });
  if (!userQuest) throw new Error("UserQuest not found");

  // Increment progress
  userQuest.progress += progressIncrement;

  // Mark completed if progress >= 100
  if (userQuest.progress >= 100) {
    userQuest.progress = 100;
    userQuest.completed = true;

    // Award EXP for completing the quest
    const quest = await Quest.findByPk(questId);
    if (quest) {
      await addExperience(userId, quest.exp_reward);
    }
  }

  await userQuest.save();
  return userQuest;
};

/**
 * Mark quest as completed manually (optional)
 */
export const completeQuest = async (userId: number, questId: number) => {
  const userQuest = await UserQuest.findOne({ where: { userId, questId } });
  if (!userQuest) throw new Error("UserQuest not found");

  if (!userQuest.completed) {
    userQuest.completed = true;

    const quest = await Quest.findByPk(questId);
    if (quest) {
      await addExperience(userId, quest.exp_reward);
    }
    await userQuest.save();
  }

  return userQuest;
};

/**
 * Fetch all active quests
 */
export const getAllActiveQuests = async () => {
  return await Quest.findAll({ where: { is_active: true } });
};
