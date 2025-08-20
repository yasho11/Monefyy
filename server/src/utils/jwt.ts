
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "30d" });
};

export {generateToken}