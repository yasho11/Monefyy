// server/src/services/transactionService.ts
import Transaction from "../models/Transaction";
import { Op } from "sequelize";

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
  title?: string;
  category?: string;
  tag?: string;
  from?: string;
  to?: string;
  sortBy?: "date" | "amount";   // optional sort field
  sortOrder?: "asc" | "desc";   // optional sort order
  limit?: number;
  offset?: number;
}

interface BulkImportOptions {
  userId: number;
  filePath: string;
  fileType: "csv" | "xlsx";
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
export const getFilteredTransactions = async (userId: number, filters: FilterOptions) => {
  const {
    title,
    category,
    tag,
    from,
    to,
    sortBy = "date",
    sortOrder = "desc",
    limit = 25,
    offset = 0,
  } = filters;

  const where: any = { userId };

  if (title) {
    where.title = { [Op.iLike]: `%${title}%` }; // case-insensitive search
  }

  if (category) {
    where.category = category;
  }

  if (tag) {
    where.tag = tag;
  }

  if (from || to) {
    where.date = {};
    if (from) where.date[Op.gte] = new Date(from);
    if (to) where.date[Op.lte] = new Date(to);
  }

  const transactions = await Transaction.findAndCountAll({
    where,
    order: [[sortBy, sortOrder]],
    limit,
    offset,
  });

  return {
    total: transactions.count,
    transactions: transactions.rows,
  };
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
 * Get single transaction 
 */

export const getTransactionById = async (userId: number, transactionId: number) => {
  return await Transaction.findOne({
    where: { id: transactionId, userId },
  });
};

/*
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
*/