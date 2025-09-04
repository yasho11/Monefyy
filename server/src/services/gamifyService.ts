import User from "../models/User";

interface LeaderboardPlayer {
  id: number;
  username: string;
  level: number;
  exp_points: number;
  streak_count: number;
  tier: string;
  rank?: number;
}

// Tier hierarchy for comparison
const TIER_ORDER: Record<string, number> = {
  Beginner: 1,
  Apprentice: 2,
  Adept: 3,
  Expert: 4,
  Master: 5,
  Grandmaster: 6,
};

export async function getLeaderboard(userId: number, limit = 50): Promise<LeaderboardPlayer[]> {
  // Fetch current user
  const currentUser = await User.findByPk(userId);
  if (!currentUser) throw new Error("User not found");

  // Determine max tier they can see
  const maxTierOrder = TIER_ORDER[currentUser.tier] || 1;

  // Fetch all users up to their tier
  const allPlayers = await User.findAll({
    attributes: ["id", "username", "level", "exp_points", "streak_count", "tier"],
  });

  // Filter by tier
  const filteredPlayers = allPlayers.filter(p => (TIER_ORDER[p.tier] || 1) <= maxTierOrder);

  // Sort: EXP desc, then streak desc
  filteredPlayers.sort((a, b) => {
    if (b.exp_points !== a.exp_points) return b.exp_points - a.exp_points;
    return (b.streak_count || 0) - (a.streak_count || 0);
  });

  // Assign ranks
  const leaderboard = filteredPlayers.map((p, index) => ({
    id: p.id,
    username: p.username,
    level: p.level,
    exp_points: p.exp_points,
    streak_count: p.streak_count,
    tier: p.tier,
    rank: index + 1,
  }));

  // Limit results
  return leaderboard.slice(0, limit);
}