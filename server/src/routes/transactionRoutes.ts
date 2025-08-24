// server/src/routes/transactionRoutes.ts
import express, { RequestHandler } from "express";
import {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransaction,
  uploadTransactions,
  downloadTransactions,
} from "../controllers/transactionController";
import { protect } from "../middlewares/authMiddleware";
import {upload} from "../middlewares/upload";


const router = express.Router();

// Protect all routes
router.use(protect);

// Create a new transaction
router.post("/", addTransaction as RequestHandler);

// Get all transactions (optionally with filters)
router.get("/", getTransactions as RequestHandler);

// Update a transaction by ID
router.put("/:id", updateTransaction as RequestHandler);

// Delete a transaction by ID
router.delete("/:id", deleteTransaction as RequestHandler);


// Get transaction by ID
router.get("/:id", getTransaction as RequestHandler );

// Post transactions in bulk
router.post("/upload", upload.single("file"), uploadTransactions as RequestHandler);


// Download all transactions as CSV
router.get("/download/csv", downloadTransactions as RequestHandler);


export default router;
