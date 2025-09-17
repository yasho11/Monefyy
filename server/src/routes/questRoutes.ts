// server/src/routes/questRoutes.ts
import { RequestHandler, Router } from "express";
import {
  assignQuest,
  fetchUserQuests,
  updateProgress,
  completeUserQuest,
  fetchActiveQuests,
  createQuest,
} from "../controllers/questController";
import { adminProtect, protect } from "../middlewares/authMiddleware"; // your JWT auth middleware

const router = Router();

/**
 * @route   POST /api/quests/assign
 * @desc    Assign a quest to a user
 * @access  Private
 */
router.post("/assign", protect, assignQuest as RequestHandler);

/**
 * @route   GET /api/quests/user
 * @desc    Get all quests for the logged-in user
 * @access  Private
 */
router.get("/user", protect, fetchUserQuests as RequestHandler);

/**
 * @route   PUT /api/quests/progress
 * @desc    Update progress for a user quest
 * @access  Private
 */
router.put("/progress", protect, updateProgress as RequestHandler);

/**
 * @route   POST /api/quests/complete
 * @desc    Manually complete a quest
 * @access  Private
 */
router.post("/complete", protect, completeUserQuest as RequestHandler);

/**
 * @route   GET /api/quests/active
 * @desc    Get all active quests in the system
 * @access  Public
 */
router.get("/active", protect, fetchActiveQuests as RequestHandler);

/**
 * @route POST /api/quests/create
 * @desc  Create all a quest in the system
 * @access Private
 */

router.post("/create", adminProtect ,createQuest);



export default router;
