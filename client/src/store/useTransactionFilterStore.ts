// store/useTransactionFilterStore.ts
import { create } from "zustand";

type SortBy = "date" | "amount";
type Order = "asc" | "desc";
type ViewMode = "grid" | "list";

interface TransactionFilterStore {
  // Filters
  search: string;
  category?: string | null;
  tag?: string | null;

  // Sorting
  sortBy: SortBy;
  sortOrder: Order; // added

  // Pagination
  limit: number; // items per page
  offset: number; // page offset

  // UI
  viewMode: ViewMode;

  // Setter functions
  setSearch: (search: string) => void;
  setCategory: (category: string | null) => void;
  setTag: (tag: string | null) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (order: Order) => void; // added
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;
  setViewMode: (mode: ViewMode) => void;

  // Reset filters to default
  resetFilters: () => void;
}

export const useTransactionFilterStore = create<TransactionFilterStore>((set) => ({
  // Initial state
  search: "",
  category: null,
  tag: null,
  sortBy: "date",
  sortOrder: "desc", // added
  limit: 25,
  offset: 0,
  viewMode: "grid",

  // Setters
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setTag: (tag) => set({ tag }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }), // added
  setLimit: (limit) => set({ limit }),
  setOffset: (offset) => set({ offset }),
  setViewMode: (viewMode) => set({ viewMode }),

  resetFilters: () =>
    set({
      search: "",
      category: null,
      tag: null,
      sortBy: "date",
      sortOrder: "desc", // added
      limit: 25,
      offset: 0,
      viewMode: "grid",
    }),
}));
