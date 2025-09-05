import { randomBytes } from "crypto";
import User from "../models/User";

// Generate unique referral code
export async function generateReferralCode(userId: number): Promise<string> {
  // generate random string
  let code: string;
  let exists: User | null;

  do {
    code = randomBytes(4).toString("hex"); // 8-character code
    exists = await User.findOne({ where: { referral_code: code } });
  } while (exists);

  // save to user
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  user.referral_code = code;
  await user.save();

  return code;
}
