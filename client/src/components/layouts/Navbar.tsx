import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Plus } from "lucide-react"; // Ensure lucide-react is installed
import defaultAvatar from "../../assets/avatar.png";
import { TransactionModal } from "../transactions/TransactionModal"; // Adjust path

interface NavbarProps {
  pageTitle: string;
}

const Navbar: React.FC<NavbarProps> = ({ pageTitle }) => {
  const { authUser, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addTransactionOpen, setAddTransactionOpen] = useState(false); // Add Transaction modal
  const [logoutModalOpen, setLogoutModalOpen] = useState(false); // Logout modal
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setLogoutModalOpen(false);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between w-full py-4 px-6 bg-white shadow-sm border-b border-gray-200">
      {/* Left side: Page title */}
      <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>

      {/* Right side: Add content + User dropdown */}
      <div className="flex items-center gap-4">
        {/* Add Transaction button */}
        <button
          onClick={() => setAddTransactionOpen(true)}
          className="flex items-center gap-1 px-4 py-2 bg-white text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>

        {/* AddTransactionModal */}
        <TransactionModal
          isOpen={addTransactionOpen}
          onClose={() => setAddTransactionOpen(false)}
        />

        {/* User info dropdown */}
        {authUser && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1 hover:bg-gray-50 transition-colors"
            >
              <img
                src={authUser.avatar_url || defaultAvatar}
                alt="Avatar"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-gray-800 text-sm">{authUser.username}</span>
              <span className="text-gray-500 text-xs">Lv. {authUser.level}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile 👤
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Settings ⚙️
                </Link>
                <button
                  onClick={() => setLogoutModalOpen(true)}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout 🚪
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {logoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
