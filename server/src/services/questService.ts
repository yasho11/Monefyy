// server/src/services/questService.ts
import UserQuest from "../models/UserQuest";
import Quest from "../models/Quest";
import User from "../models/User";
import { addExperience } from "./expService";

/**
 * Add a new quest to the database
 */
export const addQuest = async (
  title: string,
  description: string,
  type: string,
  expReward: number,
  isActive: boolean = true
) => {
  const quest = await Quest.create({
    title,
    description,
    type,
    exp_reward: expReward,
    is_active: isActive,
  });

  return quest;
};

/**
 * Assign a quest to a user
 */
export const assignQuestToUser = async (userId: number, questId: number) => {
  // Check if user already has this quest
  const existing = await UserQuest.findOne({ where: { userId, questId } });
  if (existing) return existing;

  const userQuest = await UserQuest.create({
    userId,
    questId,
    progress: 0,
    completed: false,
    assignedAt: new Date(),
    completedAt: null,
  });

  return userQuest;
};

/**
 * Fetch all quests for a user
 */
export const getUserQuests = async (userId: number) => {
  return await UserQuest.findAll({
    where: { userId },
    include: [{ model: Quest }],
  });
};

/**
 * Update progress of a user's quest
 */
export const updateQuestProgress = async (
  userId: number,
  questId: number,
  progressIncrement: number
) => {
  const userQuest = await UserQuest.findOne({ where: { userId, questId } });
  if (!userQuest) throw new Error("UserQuest not found");

  // Increment progress (nullable progress handled)
  userQuest.progress = (userQuest.progress ?? 0) + progressIncrement;

  const quest = await Quest.findByPk(questId);
  if (!quest) throw new Error("Quest not found");

  // Mark completed if progress >= target (use 100 as default if no target)
  const target = quest.target ?? 100;
  if ((userQuest.progress ?? 0) >= target && !userQuest.completed) {
    userQuest.progress = target;
    userQuest.completed = true;
    userQuest.completedAt = new Date();

    // Award EXP
    await addExperience(userId, quest.exp_reward);
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
    userQuest.completedAt = new Date();

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

/**
 * Sync all quests to a user (assign missing quests)
 */
export const syncAllQuestsToUser = async (userId: number) => {
  const allQuests = await Quest.findAll({ where: { is_active: true } });
  const assignedQuests = await UserQuest.findAll({ where: { userId } });

  const assignedQuestIds = assignedQuests.map((q) => q.questId);

  const newAssignments = allQuests
    .filter((q) => !assignedQuestIds.includes(q.id))
    .map((q) => ({ userId, questId: q.id }));

  const created = await UserQuest.bulkCreate(
    newAssignments.map((a) => ({
      ...a,
      progress: 0,
      completed: false,
      assignedAt: new Date(),
      completedAt: null,
    }))
  );

  return created;
};

/**
 * Update all active quests for a user
 * 
 */


export const updateAllUserQuestProgress = async (userId: number) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const userQuests = await UserQuest.findAll({
    where: { userId, completed: false },
    include: [Quest]
  });

  for (const uq of userQuests) {
    const quest = uq.questId ? await Quest.findByPk(uq.questId) : null;
    if (!quest?.progress_field) continue;

    const userValue = (user as any)[quest.progress_field];
    if (userValue >= (quest.target ?? 0)) {
      uq.completed = true;
      uq.progress = 100;
      await uq.save();

      // Reward EXP
      await addExperience(userId, quest.exp_reward);
    }
  }
};
