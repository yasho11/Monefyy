import React, { useState } from "react";
import { X, Edit } from "lucide-react";
import { TransactionModal } from "./TransactionModal";
import { ConfirmationModal } from "../common/ConfirmationModal";
import { useTransactionStore } from "../../store/useTransactionStore";

interface TransactionCardProps {
  transaction: {
    id: number;
    title: string;
    amount: number;
    type: "Income" | "Expense";
    category: string;
    tag?: string;
    date: string;
    recurring?: boolean;
  };
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const { deleteTransaction, isDeleting } = useTransactionStore();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async () => {
    await deleteTransaction(transaction.id);
    setIsDeleteOpen(false);
  };

  const isIncome = transaction.type === "Income";

  return (
    <>
      {/* Transaction Card */}
      <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2 w-full">
        {/* Top row: Title + Actions */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{transaction.title}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditOpen(true)}
              className="text-blue-500 hover:text-blue-700"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span
            className={`px-2 py-1 rounded-full ${
              isIncome ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {transaction.type}
          </span>
          <span className="px-2 py-1 rounded-full bg-gray-100">{transaction.category}</span>
          {transaction.tag && (
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              {transaction.tag}
            </span>
          )}
          {transaction.recurring && (
            <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
              Recurring
            </span>
          )}
        </div>

        {/* Amount + Date */}
        <div className="flex justify-between items-center mt-2">
          <span className={`font-medium ${isIncome ? "text-green-600" : "text-red-600"}`}>
            {isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
          </span>
          <span className="text-gray-400 text-sm">
            {new Date(transaction.date).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <TransactionModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          transactionToEdit={transaction}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <ConfirmationModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          actionName="delete this transaction"
          confirmButtonText={isDeleting ? "Deleting..." : "Delete"}
        />
      )}
    </>
  );
};
