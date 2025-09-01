import { RequestHandler, Router } from "express";
import { awardExp, checkIn, giveExp } from "../controllers/gamifyController";
import { protect } from "../middlewares/authMiddleware";
import { AuthRequest } from "../controllers/transactionController";

const router = Router();

// Award EXP for completing a task or goal
router.post("/exp", protect, awardExp as RequestHandler);       // For logged-in user
router.post("/exp/:id", giveExp);    // Admin / manual EXP

export default router;

