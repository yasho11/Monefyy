import { useState, useEffect } from "react";
import { useTransactionStore } from "../../store/useTransactionStore";
import { useTransactionFilterStore } from "../../store/useTransactionFilterStore";
import { useAuthStore } from "../../store/useAuthStore";
import { FiltersPanel } from "../../components/transactions/FiltersPanel";
import { TransactionModal } from "../../components/transactions/TransactionModal";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { HandCoins, Trash, Edit } from "lucide-react";

export const TransactionsPage: React.FC = () => {
  const {
    transactions = [], // default empty array
    fetchTransactions,
    deleteTransaction,
  } = useTransactionStore();

  const {
    search,
    category,
    tag,
    sortBy,
    sortOrder,
    limit,
    offset,
    viewMode,
    setViewMode,
  } = useTransactionFilterStore();

  const { authUser } = useAuthStore();

  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch transactions on mount and whenever filters change
  useEffect(() => {
    const getTransactions = async () => {
      try {
        await fetchTransactions({
          search,
          category: category ?? undefined,
          tag: tag ?? undefined,
          sortBy,
          sortOrder,
          limit,
          offset,
        });
        
      } catch (err) {
        toast.error("Failed to fetch transactions");
      }
    };
    getTransactions();
  }, [search, category, tag, sortBy, sortOrder, limit, offset, fetchTransactions]);

  // Keep filteredTransactions in sync safely
  useEffect(() => {
    if (!Array.isArray(transactions)) {
      setFilteredTransactions([]);
      return;
    }

    let filtered = [...transactions];

    // Optional local search filter
    if (search.trim()) {
      filtered = filtered.filter((tx) =>
        tx.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, search]);

  const handleEdit = (transaction: any) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;

    const success = await deleteTransaction(deleteId);
    if (success) toast.success("Transaction deleted!");
    else toast.error("Failed to delete transaction.");

    setIsDeleteModalOpen(false);
    setDeleteId(null);

    // Refetch after delete
    fetchTransactions({ search, category: category ?? undefined, tag: tag ?? undefined, sortBy, sortOrder, limit, offset });
  };

  console.log(transactions);
  return (
    <div className="p-4">
      {/* Filters */}
      <FiltersPanel
        onApplyFilters={() =>
          fetchTransactions({ search, category: category ?? undefined, tag: tag ?? undefined, sortBy, sortOrder, limit, offset })
        }
      />

      {/* View Toggle */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => setViewMode("grid")}
          className={`px-3 py-1 rounded ${
            viewMode === "grid" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          Grid
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`px-3 py-1 rounded ${
            viewMode === "list" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          List
        </button>
      </div>

      {/* Transactions */}
      {filteredTransactions.length === 0 ? (
        <p className="text-center text-gray-500">No transaction found</p>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition relative"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{tx.title}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(tx)}>
                    <Edit size={18} className="text-blue-500" />
                  </button>
                  <button onClick={() => handleDelete(tx.id)}>
                    <Trash size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-gray-600 flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {tx.category}
                </span>
               {tx.tag && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    #{tx.tag}
                  </span>
                )}
              </p>
              <p className="mt-1 font-medium flex items-center gap-1">
                <HandCoins size={16} />{" "}
                {tx.amount.toLocaleString("en-US", {
                  style: "currency",
                  currency: authUser?.currency || "USD",
                })}
              </p>
              <p className="mt-1 text-gray-500">
                {format(new Date(tx.date), "MMM dd, yyyy")}
              </p>
              {tx.recurring && (
                <span className="mt-2 inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                  Recurring
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="border rounded-lg p-4 shadow flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <h3 className="font-semibold">{tx.title}</h3>
                <p className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {tx.category}
                  </span>
                  {tx.tag && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      #{tx.tag}
                      </span>
                  )}
                </p>
                <p className="text-gray-500 text-sm">
                  {format(new Date(tx.date), "MMM dd, yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-medium">
                  {tx.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: authUser?.currency || "USD",
                  })}
                </p>
                <button onClick={() => handleEdit(tx)}>
                  <Edit size={18} className="text-blue-500" />
                </button>
                <button onClick={() => handleDelete(tx.id)}>
                  <Trash size={18} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transactionToEdit={transactionToEdit}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          actionName="delete this transaction"
        />
      )}
    </div>
  );
};
