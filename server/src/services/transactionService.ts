// server/src/services/transactionService.ts
import Transaction from "../models/Transaction";
import { Op } from "sequelize";
import fs from "fs";
import path from 'path';
import csvParser from "csv-parser";
import * as XLSX from "xlsx";
import { format } from 'date-fns';

interface TransactionInput {
  title: string;
  amount: number;
  type: "income" | "expense";
  category: "S" | "W" | "N"; // SWN enum
  tag?: string;
  recurring?: boolean;
  date?: Date;
}

interface FilterOptions {
  type?: string;
  category?: string;
  tag?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

interface BulkImportOptions {
  userId: number;
  filePath: string;
  fileType: "csv" | "xlsx";
}

export interface DownloadTransactionsOptions {
  userId: number;
  filters?: {
    type?: string;
    category?: string;
    tag?: string;
    from?: string;
    to?: string;
  };
}
/**
 * Create a new transaction for a user
 */
export const createTransaction = async (userId: number, data: TransactionInput) => {
  const transaction = await Transaction.create({
    userId,
    title: data.title,
    amount: data.amount,
    type: data.type,
    category: data.category,
    tag: data.tag,
    recurring: data.recurring || false,
    date: data.date || new Date(),
  });
  return transaction;
};

/**
 * Get all transactions for a user, optionally filtered by query params
 */
export const getTransactionsByUser = async (userId: number, filters: any) => {
  const where: any = { userId };

  if (filters.category) where.category = filters.category;
  if (filters.tag) where.tag = filters.tag;
  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date[Op.gte] = new Date(filters.startDate);
    if (filters.endDate) where.date[Op.lte] = new Date(filters.endDate);
  }

  return Transaction.findAll({ where, order: [["date", "DESC"]] });
};

/**
 * Update a transaction by ID for a specific user
 */
export const updateTransactionById = async (userId: number, id: number, data: Partial<TransactionInput>) => {
  const transaction = await Transaction.findOne({ where: { id, userId } });
  if (!transaction) return null;

  await transaction.update(data);
  return transaction;
};

/**
 * Delete a transaction by ID for a specific user
 */
export const deleteTransactionById = async (userId: number, id: number) => {
  const transaction = await Transaction.findOne({ where: { id, userId } });
  if (!transaction) return false;

  await transaction.destroy();
  return true;
};

/**
 * Get all unique tags created by a user
 */
export const getUniqueTagsByUser = async (userId: number) => {
  const transactions = await Transaction.findAll({ where: { userId }, attributes: ["tag"] });
  const tagsSet = new Set(transactions.map(t => t.tag).filter(Boolean));
  return Array.from(tagsSet);
};

/**
 * Get single transaction 
 */

export const getTransactionById = async (userId: number, transactionId: number) => {
  return await Transaction.findOne({
    where: { id: transactionId, userId },
  });
};




export const getFilteredTransactions = async (userId: number, filters: FilterOptions) => {
  const where: any = { userId };

  if (filters.type) where.type = filters.type;
  if (filters.category) where.category = filters.category;
  if (filters.tag) where.tag = filters.tag;

  if (filters.from && filters.to) {
    where.date = { [Op.between]: [filters.from, filters.to] };
  } else if (filters.from) {
    where.date = { [Op.gte]: filters.from };
  } else if (filters.to) {
    where.date = { [Op.lte]: filters.to };
  }

  return await Transaction.findAll({
    where,
    order: [["date", "DESC"]],
    limit: filters.limit,
    offset: filters.offset,
  });
};

export const importTransactions = async ({ userId, filePath, fileType }: BulkImportOptions) => {
  let transactions: any[] = [];

  if (fileType === "csv") {
    transactions = await new Promise((resolve, reject) => {
      const results: any[] = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => results.push(row))
        .on("end", () => resolve(results))
        .on("error", (err) => reject(err));
    });
  } else {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    transactions = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }

  // Normalize + insert
  const formatted = transactions.map((t: any) => ({
    userId,
    amount: parseFloat(t.amount),
    type: t.type.toLowerCase(), // "income" or "expense"
    category: t.category?.toLowerCase(),
    tag: t.tag || null,
    recurring: t.recurring === "true" || t.recurring === true,
    date: new Date(t.date),
    description: t.description || null,
  }));

  await Transaction.bulkCreate(formatted);

  return { inserted: formatted.length };
};





export const generateTransactionsCSV = async ({ userId, filters }: DownloadTransactionsOptions) => {
  // Fetch filtered transactions
  const transactions = await getFilteredTransactions(userId, filters || {});

  // Prepare CSV content
  const headers = ["id", "amount", "type", "category", "tag", "recurring", "date", "description"];
  const csvRows = [
    headers.join(","),
    ...transactions.map(t =>
      [
        t.id,
        t.amount,
        t.type,
        t.category,
        t.tag || "",
        t.recurring,
        format(new Date(t.date), "yyyy-MM-dd"),
        `"${t.description || ""}"`
      ].join(",")
    )
  ];

  const csvContent = csvRows.join("\n");

  // Ensure downloads folder exists
  const downloadsFolder = path.join(__dirname, "../downloads");
  await fs.promises.mkdir(downloadsFolder, { recursive: true });

  const timestamp = format(new Date(), "yyyyMMdd_HHmmss");
  const filePath = path.join(downloadsFolder, `transactions_${timestamp}.csv`);

  // Write CSV file
  await fs.promises.writeFile(filePath, csvContent);

  return filePath;
};