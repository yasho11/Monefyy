import { Request, Response } from "express";
import dotenv from "dotenv";
import validator from "validator";
import * as authService from "../services/authService";
import { checkIn } from "./gamifyController";
import { syncAllQuestsToUser, updateAllUserQuestProgress } from "../services/questService";
import User from "../models/User";
import { Op } from "sequelize";
import { addExperience } from "../services/expService";

dotenv.config();

interface AuthRequest extends Request {
  user?: any;
}


//?-------------------------------------------------------------------------------------



// @desc   Register new user
// @route  POST /api/auth/register

export const register = async (req: Request, res: Response) => {
  const { username, email, password, currency, referralCode } = req.body;

  if (!username || !email || !password || !currency) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    });
  }

  try {
    // --- Basic anti-abuse: check if email already exists
    const existingUser = await User.findOne({
      where: { email: { [Op.iLike]: email } },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create the user first
    const user = await authService.registerUser({
      username,
      email,
      password,
      currency,
    });

    
    // Set the JWT cookie in the controller
    res.cookie("jwt", user.token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Assign quests
    await syncAllQuestsToUser(user.id);

    // --- Referral handling ---
    if (referralCode) {
      const referrer = await User.findOne({ where: { referral_code: referralCode } });

      if (referrer && referrer.id !== user.id) {
        // Anti-abuse idea: only grant referrer reward if new user verifies email later
        // For now, grant immediately but can store in "pending rewards" table

        // Reward referrer
        await addExperience(referrer.id, 200);

        // Reward new user
        await addExperience(user.id, 50);

        // Mark who referred this user
        const userInstance = await User.findByPk(user.id);
        if (userInstance) {
          userInstance.referred_by = referrer.id;
          await userInstance.save();
        }
      }
    }

    res.status(201).json(user);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message || "Registration failed" });
  }
};


//?-------------------------------------------------------------------------------------



// @desc   Login user
// @route  POST /api/auth/login
export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Please provide all fields" });

  try {
    const user = await authService.loginUser(email, password);


    const token = user.token;

    // Set the JWT cookie in the controller
    res.cookie("jwt", user.token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });


    console.log("Response headers: ", res.getHeaders(), "Token: " , token);
    // Run streak/check-in logic
    const streakResult = await checkIn(user, res);

    await syncAllQuestsToUser(user.id);
    await updateAllUserQuestProgress(user.id);

    res.json({
      ...user,
      streak: streakResult?.streak ?? 0,
      expGained: streakResult?.expGained ?? 0,
      message: streakResult?.message ?? "",
      lastActive: user.last_active_date,
    });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message || "Login failed" });
  }
};




//?-------------------------------------------------------------------------------------


// @desc   Get current user info
// @route  GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = req.user;

    // Optionally update quest progress before returning
    await updateAllUserQuestProgress(user.id);

    // Include any extra computed fields if needed
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      currency: user.currency,
      avatar_url: user.avatar_url,
      is_verified: user.is_verified,
      streak: user.streak_count,
      expGained: user.expGained ?? 0,
      lastActive: user.last_active_date,
      subscription: user.subscription ?? null, // optional
      tier: user.tier ?? null,                 // optional
      level: user.level ?? null,               // optional
    };

    return res.json(userData);
  } catch (err: any) {
    console.error("Get current user error:", err);
    return res.status(500).json({ message: "Failed to fetch current user" });
  }
};



//?-------------------------------------------------------------------------------------



// @desc   Handle Google OAuth callback
// @route  GET /api/auth/google/callback
export const googleCallback = async (req: Request, res: Response) => {
  const user = (req.user as any)?.user;
  const token = (req.user as any)?.token;

  if (!user || !token) {
    return res.status(400).json({ message: "Google login failed" });
  }

  await syncAllQuestsToUser(user.id);
  await updateAllUserQuestProgress(user.id);

  return res.status(200).json({
    id: user.id,
    username: user.username,
    email: user.email,
    token,
  });
};






//?-------------------------------------------------------------------------------------

// @desc   Send email verification code
// @route  POST /api/auth/send-verification
export const sendVerification = async (req: AuthRequest, res: Response) => {
  try {
    const result = await authService.sendVerificationCode(req.user.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

//?-----------------------------------------------------------------------------------------------

// @desc   Verify email
// @route  POST /api/auth/verify-email
export const verifyEmail = async (req: AuthRequest, res: Response) => {
  const { code } = req.body;
  try {
    const result = await authService.verifyEmail(req.user.id, code);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};



//?---------------------------------------------------------------------------------------------------

// @desc   Send reset password code
// @route  POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const result = await authService.sendResetPasswordCode(email);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};



//?--------------------------------------------------------------------------------------------

// @desc   Reset password
// @route  POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  try {
    const result = await authService.resetPassword(email, code, newPassword);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


//? ------------------------------------------------------------------------

// @desc   Update profile
// @route  PUT /api/auth/profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { username, currency } = req.body;
  try {
    const updated = await authService.updateProfile(req.user.id, { username, currency });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


//?---------------------------------------------------------------------------------


// @desc   Update currency
// @route  PUT /api/auth/currency
export const setCurrency = async (req: AuthRequest, res: Response) => {
  const { currency } = req.body;
  try {
    const result = await authService.setCurrency(req.user.id, currency);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};



//?--------------------------------------------------------------------------------

//@desc Check if the email is verified
//@route GET /api/auth/email-verified
export const isEmailVerified = async(req: AuthRequest, res: Response) => {
  try{
    const user = await User.findByPk(req.user.id);
    if(!user) return res.status(404).json({message: "User not found"});
    return res.json ({is_verified: user.is_verified});
  }catch(err: any){
    res.status(400).json({message: err.message});
  }
}



//?-----------------------------------------------------------------------------------------------
// @desc Check if the user is authenticated
// @route GET /api/auth/check-auth

export const checkAuth = async (req: Request, res: Response)=> {
  try {
    const user = req.user;
    if(!user){
      res.status(401).json({message: "Unauthorized"});
      return;
    }
    res.status(200).json({User: user});
  } catch (error) {

    console.error(error);
    res.status(500).json({message: "Internal server error", error});

  }
}


//?-------------------------------------------------------------------------------

// @name: Logout
// @desc: help logout

export const logout = async(req: Request, res: Response) =>{

  res.clearCookie("jwt", {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({message: "Logged out successfully"});

}
