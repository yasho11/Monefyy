import User from "../models/User";
import { addExperience as addExp} from "./expService";

export const updateStreak = async (userId: number) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const today = new Date();
  const lastActive = user.last_active_date ? new Date(user.last_active_date) : null;

  let expReward = 0;

  if (lastActive) {
    const diffInDays = Math.floor(
      (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      // Already active today, no streak change
      return { message: "Already checked in today", streak: user.streak_count };
    }

    if (diffInDays === 1) {
      // Continue streak
      user.streak_count += 1;
      expReward = 10; // daily reward
    } else {
      // Missed days, reset streak
      user.streak_count = 1;
      expReward = 10; // still give daily reward
    }
  } else {
    // First-time streak
    user.streak_count = 1;
    expReward = 10;
  }

  // Special rewards
  if (user.streak_count % 7 === 0) {
    expReward += 50; // Weekly bonus
  }
  if (user.streak_count % 30 === 0) {
    expReward += 200; // Monthly bonus
  }

  // Update last_active_date
  user.last_active_date = today;

  await user.save();

  // Grant EXP
  await addExp(userId, expReward);

  return {
    message: `Streak updated! +${expReward} EXP`,
    streak: user.streak_count,
    expGained: expReward,
  };
};
