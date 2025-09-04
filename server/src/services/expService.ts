import User from "../models/User";

//Hard coded tier ladder
const TIER_LADDER = [
  { status: "Beginner", minLevel: 1, maxLevel: 9, order: 1 },
  { status: "Apprentice", minLevel: 10, maxLevel: 19, order: 2 },
  { status: "Adept", minLevel: 20, maxLevel: 34, order: 3 },
  { status: "Expert", minLevel: 35, maxLevel: 49, order: 4 },
  { status: "Master", minLevel: 50, maxLevel: 74, order: 5 },
  { status: "Grandmaster", minLevel: 75, maxLevel: Infinity, order: 6 },
];


function expRequiredForLevel(level: number): number {
  return level * 100; // simple linear growth
}

export async function addExperience(userId: number, expGained: number) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  user.exp_points += expGained;
  user.lifetime_exp += expGained;

  // Handle level-ups and tier updates
  updateLevel(user);

  await user.save();
  return user;
}


export function updateLevel(user: any) {
  let expNeeded = expRequiredForLevel(user.level);

  while (user.exp_points >= expNeeded) {
    user.exp_points -= expNeeded;
    user.level += 1;
    expNeeded = expRequiredForLevel(user.level);

    // Update tier after each level-up
    updateTier(user);
  }
}



export function updateTier(user: any) {
  // Find the highest tier the user qualifies for
  const newTier = TIER_LADDER
    .filter(t => user.level >= t.minLevel)
    .sort((a, b) => b.minLevel - a.minLevel)[0]; // pick highest applicable tier

  if (newTier && user.tier !== newTier.status) {
    user.tier = newTier.status;
    // Optional: trigger notification or reward here
    console.log(`🎉 ${user.username} is now a ${newTier.status}!`);
  }
}
