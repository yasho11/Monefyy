import { RequestHandler, Router } from "express";
import { awardExp, giveExp , leaderboard} from "../controllers/gamifyController";
import { adminProtect, protect } from "../middlewares/authMiddleware";
import { AuthRequest } from "../controllers/transactionController";

const router = Router();

// Award EXP for completing a task or goal
router.post("/exp", protect, adminProtect, awardExp as RequestHandler);       // For logged-in user
router.post("/exp/:id", adminProtect ,giveExp);    // Admin / manual EXP
router.get("/leaderboard", protect, leaderboard as RequestHandler);
export default router;

