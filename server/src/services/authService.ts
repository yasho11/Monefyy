import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { sendEmail } from "../utils/mailer";
import { v4 as uuidv4 } from "uuid";
import { AuthUserDTO } from "../utils/authDTO";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  currency: string;
  referred_by?: number;
}

export const registerUser = async ({ username, email, password, currency, referred_by }: RegisterData) => {
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const avatar_url = `https://avatar.iran.liara.run/public/${username}`;

  const user = await User.create({
    username,
    email,
    password_hash,
    currency,
    avatar_url,
    is_verified: false,
    referred_by,
  });

  // Generate and send verification code
  const verificationCode = uuidv4().split("-")[0]; // short code
  user.verification_code = verificationCode;
  await user.save();

  await sendEmail(user.email, "Verify your account", `Your verification code is: ${verificationCode}`);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    currency: user.currency,
    avatar_url: user.avatar_url,
    token: generateToken(user.id),
    referred_by: user.referred_by,
  };
};

export const loginUser = async (email: string, password: string): Promise<AuthUserDTO> => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password_hash || "");
  if (!isMatch) throw new Error("Invalid credentials");

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    currency: user.currency,
    avatar_url: user.avatar_url,
    is_verified: user.is_verified,
    token: generateToken(user.id),
    last_active_date: user.last_active_date,
  };
};

export const sendVerificationCode = async (userId: number) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const code = uuidv4().split("-")[0];
  user.verification_code = code;
  await user.save();

  await sendEmail(user.email, "Verify your account", `Your verification code is: ${code}`);
  return { message: "Verification code sent" };
};

export const verifyEmail = async (userId: number, code: string) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  if (user.verification_code !== code) throw new Error("Invalid verification code");

  user.is_verified = true;
  user.verification_code = undefined;
  await user.save();

  return { message: "Email verified successfully" };
};

export const sendResetPasswordCode = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  const resetCode = uuidv4().split("-")[0];
  user.reset_code = resetCode;
  user.reset_code_expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry
  await user.save();

  await sendEmail(user.email, "Reset your password", `Your reset code is: ${resetCode}`);
  return { message: "Reset code sent" };
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");

  if (user.reset_code !== code || !user.reset_code_expires || user.reset_code_expires < new Date()) {
    throw new Error("Invalid or expired reset code");
  }

  const salt = await bcrypt.genSalt(10);
  user.password_hash = await bcrypt.hash(newPassword, salt);
  user.reset_code = undefined;
  user.reset_code_expires = undefined;
  await user.save();

  return { message: "Password reset successful" };
};

export const updateProfile = async (
  userId: number,
  updates: { username?: string; currency?: string }
) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  if (updates.username) user.username = updates.username;
  if (updates.currency) user.currency = updates.currency;

  await user.save();
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    currency: user.currency,
    avatar_url: user.avatar_url,
  };
};

export const setCurrency = async (userId: number, currency: string) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  user.currency = currency;
  await user.save();

  return { message: "Currency updated", currency: user.currency };
};



export async function markEmailSent(user: User) {
  user.last_email_sent = new Date();
  await user.save();
}