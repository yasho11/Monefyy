import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import { toast } from "react-hot-toast";
import axios from "axios";

interface FilterOptions {
  title?: string;
  category?: string;
  tag?: string;
  from?: string;
  to?: string;
  sortBy?: "date" | "amount";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
  search?:string;
}

interface TransactionStore {
  transactions: any[];
  isAdding: boolean;
  isLoading: boolean;
  isEditing: boolean;
  isDeleting: boolean;

  fetchTransactions: (filters?: FilterOptions) => Promise<void>;
  addTransaction: (data: any) => Promise<boolean>;
  editTransaction: (id: number, data: any) => Promise<boolean>;
  deleteTransaction: (id: number) => Promise<boolean>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  isAdding: false,
  isLoading: false,
  isEditing: false,
  isDeleting: false,

  //! Fetch all transactions with optional filters
  fetchTransactions: async (filters?: FilterOptions) => {
    try {
      set({ isLoading: true });
      const params = filters || {};
      const response = await axiosInstance.get("/transactions", { params });
      set({ transactions: response.data.transactions || [] });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Fetch Transactions Error:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to fetch transactions");
      } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong!");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  //! Add a new transaction
  addTransaction: async (data: any) => {
    try {
      set({ isAdding: true });
      await axiosInstance.post("/transactions", data);
      toast.success("Transaction added successfully!");
      // Refresh the list
      await get().fetchTransactions();
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Add Transaction Error:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to add transaction");
      } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong!");
      }
      return false;
    } finally {
      set({ isAdding: false });
    }
  },

  //! Edit a transaction by ID
  editTransaction: async (id: number, data: any) => {
    try {
      set({ isEditing: true });
      await axiosInstance.put(`/transactions/${id}`, data);
      toast.success("Transaction updated successfully!");
      // Refresh the list
      await get().fetchTransactions();
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Edit Transaction Error:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to edit transaction");
      } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong!");
      }
      return false;
    } finally {
      set({ isEditing: false });
    }
  },

  //! Delete a transaction by ID
  deleteTransaction: async (id: number) => {
    try {
      set({ isDeleting: true });
      await axiosInstance.delete(`/transactions/${id}`);
      toast.success("Transaction deleted successfully!");
      // Refresh the list
      await get().fetchTransactions();
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Delete Transaction Error:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to delete transaction");
      } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong!");
      }
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },
}));
