import { Router } from "express";
import { giveExp } from "../controllers/expController";

const router = Router();

/**
 * @route   POST /api/exp/:id
 * @desc    Add EXP to a user and handle level ups
 * @access  Private (you can add auth middleware later)
 */
router.post("/:id", giveExp);

export default router;
