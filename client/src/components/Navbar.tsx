// Navbar.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Plus } from "lucide-react"; // Ensure lucide-react is installed

interface NavbarProps {
  pageTitle: string;
  onAddClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ pageTitle, onAddClick }) => {
  const { authUser, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/login")
  };

  return (
    <div className="flex items-center justify-between w-full py-4 px-6 bg-white shadow-sm border-b border-gray-200">
      {/* Left side: Page title */}
      <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>

      {/* Right side: Add content + User dropdown */}
      <div className="flex items-center gap-4">
        {/* Add content button */}
        <button
          onClick={onAddClick}
          className="flex items-center gap-1 px-4 py-2 bg-white text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>

        {/* User info dropdown */}
        {authUser && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1 hover:bg-gray-50 transition-colors"
            >
              <img
                src={authUser.avatar_url}
                alt="User Avatar"
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
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout 🚪
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
