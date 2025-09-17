import { RequestHandler, Router } from "express";
import { body, param } from "express-validator";
import {
  createGoal,
  getGoals,
  updateGoal,
  completeGoal,
  deleteGoal,
} from "../controllers/goalController";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validate";

const router = Router();

// Create Goal
router.post(
  "/create",
  protect,
  [
    body("title").isString().trim().notEmpty().withMessage("Title is required"),
    body("description").isString().trim().optional(),
    body("priority")
      .isIn(["low", "medium", "high"])
      .withMessage("Priority must be low, medium, or high"),
  ],
  validateRequest,
  createGoal as RequestHandler
);

// Get All Goals
router.get("/get", protect, getGoals as RequestHandler);

// Update Goal
router.put(
  "/update/:id",
  protect,
  [
    param("id").isInt().withMessage("Goal ID must be an integer"),
    body("title").optional().isString().trim(),
    body("description").optional().isString().trim(),
    body("priority").optional().isIn(["low", "medium", "high"]),
  ],
  validateRequest,
  updateGoal as RequestHandler
);

// Complete Goal
router.put(
  "/:id/complete",
  protect,
  [param("id").isInt().withMessage("Goal ID must be an integer")],
  validateRequest,
  completeGoal as RequestHandler
);

// Delete Goal
router.delete(
  "/delete/:id",
  protect,
  [param("id").isInt().withMessage("Goal ID must be an integer")],
  validateRequest,
  deleteGoal as RequestHandler
);

export default router;
