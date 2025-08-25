import { Request, Response } from "express";
import { addExperience } from "../services/expService";

export const giveExp = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const { exp } = req.body;

    if (!exp || typeof exp !== "number") {
      return res.status(400).json({ message: "Invalid EXP amount" });
    }

    const updatedUser = await addExperience(userId, exp);
    res.json({
      message: `Added ${exp} EXP`,
      level: updatedUser.level,
      current_exp: updatedUser.exp_points,
      lifetime_exp: updatedUser.lifetime_exp,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
