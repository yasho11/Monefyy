import User from "../models/User";

function expRequiredForLevel(level: number): number {
  return level * 100; // simple linear formula
}

export async function addExperience(userId: number, expGained: number) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  // Add exp
  user.exp_points += expGained;
  user.lifetime_exp += expGained;

  // Level up check with carryover
  let expNeeded = expRequiredForLevel(user.level);
  while (user.exp_points >= expNeeded) {
    user.exp_points -= expNeeded; // carry over
    user.level += 1;
    expNeeded = expRequiredForLevel(user.level);
  }

  await user.save();
  return user;
}