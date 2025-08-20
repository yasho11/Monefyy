// server/src/controllers/financeController.ts
import { Response } from "express";
import {
  createFinanceProfile,
  updateFinanceProfile,
  getFinanceProfileByUser,
} from "../services/financeService";
import { validateFinanceInput, FinanceInput } from "../utils/financeUtils";

// Define a custom request type with user
interface AuthRequest {
  user?: {
    id: number;
    username?: string;
    email?: string;
  };
  body: any;
  params: any;
}

// @desc    Create a new FinanceProfile
// @route   POST /api/finance
// @access  Private
export const createFinance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const financeData = req.body as FinanceInput;

    // Validate input
    const validationError = validateFinanceInput(financeData);
    if (validationError) return res.status(400).json({ message: validationError });

    // Check if profile already exists
    const existingProfile = await getFinanceProfileByUser(userId);
    if (existingProfile) return res.status(400).json({ message: "Finance profile already exists" });

    const profile = await createFinanceProfile(userId, financeData);
    res.status(201).json(profile);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get current user's FinanceProfile
// @route   GET /api/finance
// @access  Private
export const getFinance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const profile = await getFinanceProfileByUser(userId);
    if (!profile) return res.status(404).json({ message: "Finance profile not found" });

    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update FinanceProfile
// @route   PUT /api/finance/:id
// @access  Private
export const updateFinance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const financeData = req.body as FinanceInput;

    // Validate input
    const validationError = validateFinanceInput(financeData);
    if (validationError) return res.status(400).json({ message: validationError });

    const { id } = req.params;

    // Fetch profile and validate ownership
    const profile = await getFinanceProfileByUser(userId);
    if (!profile || profile.id !== Number(id)) {
      return res.status(404).json({ message: "Finance profile not found or unauthorized" });
    }

    const updatedProfile = await updateFinanceProfile(Number(id), financeData);
    res.json(updatedProfile);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
