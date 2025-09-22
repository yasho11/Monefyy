// server/src/controllers/transactionController.ts
import { Response } from "express";
import fs from "fs/promises";
import path from "path";
import { format } from "date-fns";
import Transaction from "../models/Transaction";
import {
  createTransaction,
  getFilteredTransactions,
  updateTransactionById,
  deleteTransactionById,
  getTransactionById,
  generateTransactionsCSV,
} from "../services/transactionService";

// Custom AuthRequest type
export interface AuthRequest {
  user?: { id: number; username?: string; email?: string };
  body: any;
  params: any;
  query: any;
  file?: Express.Multer.File;
}

// ------------------- Existing CRUD operations -------------------

export const addTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const transactionData = req.body;
    const transaction = await createTransaction(userId, transactionData);
    res.status(201).json(transaction);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { type, category, tag, from, to, limit, offset } = req.query;
    const filters = {
      type: type as string | undefined,
      category: category as string | undefined,
      tag: tag as string | undefined,
      from: from as string | undefined,
      to: to as string | undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined,
    };

    const transactions = await getFilteredTransactions(userId, filters);
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const updatedData = req.body;
    const updatedTransaction = await updateTransactionById(userId, Number(id), updatedData);

    if (!updatedTransaction) return res.status(404).json({ message: "Transaction not found" });

    res.json(updatedTransaction);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const deleted = await deleteTransactionById(userId, Number(id));
    if (!deleted) return res.status(404).json({ message: "Transaction not found" });

    res.json({ message: "Transaction deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const transaction = await getTransactionById(userId, Number(id));
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.json(transaction);
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
};


// ------------------- Download CSV -------------------

export const downloadTransactions = async (req: AuthRequest, res: Response) => {
  try{
    const userId = req.user?.id;
    if(!userId) return res.status(401).json({message: "Unauthorized"});

    const {type, category, tag, from, to} = req.query;

    const filters = {type, category , tag , from , to};

    const filePath = await generateTransactionsCSV({userId, filters});

    res.download(filePath, (err)=> {
      if(err){
        console.error("Download error: ", err);
        res.status(500).json({message: "Error downloading transactions", err});
      }else{
        fs.unlink(filePath).catch(err => console.error("Error deleting CSV: ", err));
      }
    })
 
  }catch(err: any){
    console.error("error generation CSV: ", err);
    res.status(500).json({message: "Server error", error: err.message});
  }
  
}