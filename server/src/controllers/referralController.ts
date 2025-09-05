import { Request, Response } from "express";
import { generateReferralCode } from "../services/referralService";
import { AuthRequest } from "./transactionController" 

export const createReferralCode = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id; // 🔥 assumes you’re using auth middleware to attach `req.user`

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized"})
    }
    const code = await generateReferralCode(userId);

    res.status(201).json({
      message: "Referral code generated successfully",
      referral_code: code,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to generate referral code" });
  }
};
