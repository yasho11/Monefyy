import User from "../models/User";

function expRequiredForLevel(level: number): number {
  return level * 100; // simple linear growth
}

export async function addExperience(userId: number, expGained: number) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  user.exp_points += expGained;
  user.lifetime_exp += expGained;

  // Handle level-ups with carryover
  let expNeeded = expRequiredForLevel(user.level);
  while (user.exp_points >= expNeeded) {
    user.exp_points -= expNeeded;
    user.level += 1;
    expNeeded = expRequiredForLevel(user.level);
  }

  await user.save();
  return user;
}
