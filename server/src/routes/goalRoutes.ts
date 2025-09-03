import { RequestHandler, Router } from "express";
import {
  createGoal,
  getGoals,
  updateGoal,
  completeGoal,
  deleteGoal
} from "../controllers/goalController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.post("/create", protect,createGoal as RequestHandler);
router.get("/get", protect, getGoals as RequestHandler);
router.put("/update/:id", updateGoal);
router.put("/:id/complete", protect ,completeGoal as RequestHandler); // manual completion
router.delete("/delete/:id", deleteGoal);

export default router;
