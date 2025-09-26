import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTransactionStore } from "../../store/useTransactionStore";
import { useAuthStore } from "../../store/useAuthStore";
import { X } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: any; // transaction object for editing
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  transactionToEdit,
}) => {
  const { addTransaction, editTransaction, isAdding } = useTransactionStore();
  const { authUser } = useAuthStore();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");
  const [category, setCategory] = useState("Savings");
  const [tag, setTag] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [date, setDate] = useState("");

  // Load transaction data in edit mode
  useEffect(() => {
    if (transactionToEdit) {
      setTitle(transactionToEdit.title || "");
      setAmount(transactionToEdit.amount?.toString() || "");
      setType(transactionToEdit.type || "Income");
      setCategory(transactionToEdit.category || "Savings");
      setTag(transactionToEdit.tag || "");
      setRecurring(transactionToEdit.recurring || false);
      setDate(transactionToEdit.date ? transactionToEdit.date.split("T")[0] : "");
    } else {
      setTitle("");
      setAmount("");
      setType("Income");
      setCategory("Savings");
      setTag("");
      setRecurring(false);
      setDate("");
    }
  }, [transactionToEdit]);

  const handleSubmit = async () => {
    if (!title.trim() || !amount || !tag) {
      return toast.error("Please fill in title, amount and select a tag");
    }

    const transactionData = {
      title,
      amount: Number(amount),
      type,
      category,
      tag, // single tag from dropdown
      recurring,
      date: date ? new Date(date) : new Date(),
    };

    let success = false;
    if (transactionToEdit) {
      success = await editTransaction(transactionToEdit.id, transactionData);
    } else {
      success = await addTransaction(transactionData);
    }

    if (success) {
      toast.success(transactionToEdit ? "Transaction updated!" : "Transaction added!");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {transactionToEdit ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button onClick={onClose}>
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Form: 2 Rows */}
        <div className="grid grid-cols-2 gap-4">
          {/* Row 1 */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="Transaction title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full py-2 px-3 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input input-bordered w-full py-2 px-3 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>

          {/* Row 2 */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="select select-bordered w-full rounded-lg focus:ring focus:ring-green-200"
            >
              <option>Income</option>
              <option>Expense</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select select-bordered w-full rounded-lg focus:ring focus:ring-green-200"
            >
              <option>Savings</option>
              <option>Wants</option>
              <option>Needs</option>
            </select>
          </div>

          {/* Row 3: Tag dropdown */}
          <div className="col-span-2 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Tag</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="select select-bordered w-full rounded-lg focus:ring focus:ring-green-200"
            >
              <option value="">Select a tag</option>
              {authUser?.tags?.map((t: string, idx: number) => (
                <option key={idx} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Row 4: Date + Recurring */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input input-bordered w-full py-2 px-3 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              id="recurring"
              className="mr-2"
            />
            <label htmlFor="recurring" className="text-sm text-gray-700">
              Recurring
            </label>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={isAdding}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg shadow-md transition"
        >
          {isAdding
            ? transactionToEdit
              ? "Updating..."
              : "Adding..."
            : transactionToEdit
            ? "Update Transaction"
            : "Add Transaction"}
        </button>
      </div>
    </div>
  );
};
