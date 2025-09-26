import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import currencies from "../../data/currencies.json";
import { toast } from "react-hot-toast";
import { ConfirmationModal } from "../common/ConfirmationModal"; // import your confirmation modal

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateProfileModal = ({ isOpen, onClose }: UpdateProfileModalProps) => {
  const { userInfo, UpdateProfile } = useAuthStore();
  const [username, setUsername] = useState("");
  const [currency, setCurrency] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setCurrency(userInfo.currency);
    }
  }, [userInfo]);

  const handleUpdateClick = () => {
    if (!username || !currency) {
      toast.error("Please fill all fields");
      return;
    }
    // Show confirmation modal instead of immediately updating
    setShowConfirm(true);
  };

  const handleConfirmUpdate = async () => {
    setShowConfirm(false);
    const success = await UpdateProfile({ username, currency });
    if (success) {
      toast.success("Profile updated!");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Currency */}
          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateClick}
              className="py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <ConfirmationModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirmUpdate}
          actionName="update your profile"
        />
      )}
    </>
  );
};
