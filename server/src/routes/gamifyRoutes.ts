import { RequestHandler, Router } from "express";
import { awardExp, checkIn } from "../controllers/gamifyController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// Award EXP for completing a task or goal
router.post("/add-exp", protect, awardExp as RequestHandler);

// Daily/weekly check-in to update streaks and reward EXP
router.post("/check-in", protect, checkIn as RequestHandler);

export default router;
