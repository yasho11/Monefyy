import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { sendEmail } from "../utils/mailer";
import { v4 as uuidv4 } from "uuid";
import { AuthUserDTO } from "../utils/authDTO";
import cloudinary from "../config/cloudinary";

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

  const avatar_url = `https://avatar.iran.liara.run/username?username=${username}`;

  const user = await User.create({
    username,
    email,
    password_hash,
    currency,
    avatar_url,
    is_verified: false,
    referred_by,
  });

  const code = await sendVerificationCode(user.id);

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
    avatar_url: user.avatar_url || 'https://avatar.iran.liara.run/public/',
    is_verified: user.is_verified,
    token: generateToken(user.id),
    last_active_date: user.last_active_date,
  };
};

export const sendVerificationCode = async (userId: number) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.verification_code = code;
  await user.save();

  const htmlContent = `
<div style="font-family: Arial, sans-serif; color: #333;">
  <h2 style="color: #4CAF50;">Verify Your Account</h2>
  <p>Hello,</p>
  <p>We received a request to verify your account. Use the code below:</p>
  <div style="font-size: 1.5rem; font-weight: bold; margin: 10px 0; color: #000;">
    ${code}
  </div>
  <p>
    Click the button below to verify your account:
  </p>
  <a
    href="http://localhost:5173/verify"
    style="
      display: inline-block;
      padding: 10px 20px;
      margin-top: 10px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    "
  >
    Verify Account
  </a>
  <p style="margin-top: 15px; font-size: 0.9rem; color: #777;">
    If you didn't request this verification, you can safely ignore this email.
  </p>
  <p>— The Monefyy Team</p>
</div>
`;

const textContent = `
Your verification code is: ${code}
Please visit the following link to verify your account: http://localhost:5173/verify
`;

await sendEmail(user.email, "Verify your account", textContent, htmlContent);

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

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.reset_code = resetCode;
  user.reset_code_expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry
  await user.save();
  const htmlContent = `
<div style="font-family: Arial, sans-serif; color: #333;">
  <h2 style="color: #4CAF50;">Reset Your Password</h2>
  <p>Hello,</p>
  <p>We received a request to reset your password. Use the code below to reset it:</p>
  <div style="font-size: 1.5rem; font-weight: bold; margin: 10px 0; color: #000;">
    ${resetCode}
  </div>
  <p>This code will expire in <strong>15 minutes</strong>.</p>
  <p>
    Click the button below to reset your password:
  </p>
  <a
    href="http://localhost:5173/reset-password"
    style="
      display: inline-block;
      padding: 10px 20px;
      margin-top: 10px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    "
  >
    Reset Password
  </a>
  <p style="margin-top: 15px; font-size: 0.9rem; color: #777;">
    If you didn't request a password reset, you can safely ignore this email.
  </p>
  <p>— The Monefyy Team</p>
</div>
`;

const textContent = `
Your verification code is: ${resetCode}
Please visit the following link to verify your account: http://localhost:5173/reset-password
`;
await sendEmail(user.email, "Verify your account", textContent, htmlContent);

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


//?-----------------------------------------------------------------

export const updateProfilePicture = async (userId: string, file: Express.Multer.File) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  // If user already has a profile picture, delete the old one
  if (user.avatar_public_id) {
    await cloudinary.uploader.destroy(user.avatar_public_id);
  }

  // Upload new image to Cloudinary
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "profiles",
    transformation: [{ width: 300, height: 300, crop: "fill" }],
  });

  // Save to DB
  user.avatar_url = result.secure_url;
  user.avatar_public_id = result.public_id;
  await user.save();

  return user;
};