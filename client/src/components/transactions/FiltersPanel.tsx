import { useTransactionFilterStore } from "../../store/useTransactionFilterStore";
import { useAuthStore } from "../../store/useAuthStore";

interface FiltersPanelProps {
  onApplyFilters: () => void; // callback when filters change
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ onApplyFilters }) => {
  const { authUser } = useAuthStore();
  const {
    search,
    setSearch,
    category: category,
    setCategory,
    tag,
    setTag,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    limit,
    setLimit,
  } = useTransactionFilterStore();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newSortOrder] = e.target.value.split("-") as [
      "date" | "amount",
      "asc" | "desc"
    ];
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input input-bordered w-full md:w-1/4 rounded-lg focus:ring focus:ring-green-200"
      />

      {/* Category */}
      <select
        value={category || ""}
        onChange={(e) => setCategory(e.target.value || null)}
        className="select select-bordered w-full md:w-1/4 rounded-lg focus:ring focus:ring-green-200"
      >
        <option value="">All Categories</option>
        <option value="Savings">Savings</option>
        <option value="Wants">Wants</option>
        <option value="Needs">Needs</option>
      </select>

      {/* Tags */}
      <select
        value={tag || ""}
        onChange={(e) => setTag(e.target.value || null)}
        className="select select-bordered w-full md:w-1/4 rounded-lg focus:ring focus:ring-green-200"
      >
        <option value="">All Tags</option>
        {authUser?.tags?.map((t: string, idx: number) => (
          <option key={idx} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={`${sortBy}-${sortOrder}`}
        onChange={handleSortChange}
        className="select select-bordered w-full md:w-1/4 rounded-lg focus:ring focus:ring-green-200"
      >
        <option value="date-desc">Date (Newest)</option>
        <option value="date-asc">Date (Oldest)</option>
        <option value="amount-desc">Amount (High → Low)</option>
        <option value="amount-asc">Amount (Low → High)</option>
      </select>

      {/* Pagination */}
      <select
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
        className="select select-bordered w-full md:w-1/6 rounded-lg focus:ring focus:ring-green-200"
      >
        <option value={25}>25 per page</option>
        <option value={50}>50 per page</option>
      </select>

      {/* Apply Filters button */}
      <button
        onClick={onApplyFilters}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
      >
        Apply
      </button>
    </div>
  );
};
