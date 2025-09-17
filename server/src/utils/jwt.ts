
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

export {generateToken}