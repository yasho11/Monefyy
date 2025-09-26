// Sidebar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, List, Wallet, FileText, Target, Sword, ArrowLeftToLine, ArrowRightToLine } from "lucide-react";

interface SidebarProps {
  onToggle?: (isCollapsed: boolean) => void;
}

const Sidebar = ({ onToggle }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <BarChart3 size={20} />, path: "/" },
    { name: "Transactions", icon: <List size={20} />, path: "/transaction" },
    { name: "Budgets", icon: <Wallet size={20} />, path: "/" },
    { name: "Reports", icon: <FileText size={20} />, path: "/" },
    { name: "Goals", icon: <Target size={20} />, path: "/" },
    { name: "Quest", icon: <Sword size={20} />, path: "/" },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (onToggle) onToggle(!isCollapsed);
  };

  return (
    <aside
        className={`fixed top-0 left-0 h-screen bg-white shadow-md flex flex-col justify-between transition-all duration-300 ${
    isCollapsed ? "w-20" : "w-64"
  }`}
    >
      {/* Top Section */}
      <div>
        <div className="flex items-center p-4 border-b border-gray-200">
          <Wallet className="text-gray-800" size={24} />
          {!isCollapsed && (
            <h1 className="ml-2 text-xl font-bold text-gray-800">Monefyy</h1>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center space-x-3 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              {item.icon}
              {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Toggle Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={toggleSidebar}
          className="flex items-center w-full justify-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
        >
          {isCollapsed ? <ArrowRightToLine size={20} /> : <ArrowLeftToLine size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
