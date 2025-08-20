// server/src/routes/financeRoutes.ts
import { Router } from "express";
import { createFinance, getFinance, updateFinance } from "../controllers/financeController";
import {protect} from "../middlewares/authMiddleware";

const router = Router();

// Create FinanceProfile
router.post("/", protect, createFinance);

// Get current user's FinanceProfile
router.get("/", protect, getFinance);

// Update FinanceProfile
router.put("/:id", protect, updateFinance);

export default router;
