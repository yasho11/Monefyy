import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Package, Star, Target, Flame, HandCoins, Check } from "lucide-react";
import { UpdateProfileModal } from "../../components/auth/UpdateProfileModals";

export const ProfilePage = () => {
  const { authUser, getUserInfo, isCheckingAuth, userInfo, isGettingInfo, updateProfilePicture } =
    useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isCheckingAuth && authUser) {
      getUserInfo();
    }
  }, [authUser, getUserInfo, isCheckingAuth]);

  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      navigate("/login");
    }
  }, [authUser, isCheckingAuth, navigate]);

  if (isCheckingAuth || !userInfo || isGettingInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-xl font-semibold">Loading... ⏳</h1>
      </div>
    );
  }

  const User = userInfo;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    const success = await updateProfilePicture(file);
    setIsUploading(false);
    if (!success) {
      toast.error("Failed to update profile picture.");
    }
  };

  const expPercentage = Math.min((User.exp_point / User.exp_needed) * 100, 100);

  const stats = [
    { label: "Subscription", value: User.subscription.toUpperCase() ?? "-", icon: <Package size={20} /> },
    { label: "Tier", value: User.tier ?? "-", icon: <Star size={20} /> },
    { label: "Level", value: User.level, icon: <Target size={20} /> },
    { label: "Streak", value: `${User.streak ?? "-"} days`, icon: <Flame size={20} /> },
    { label: "Currency", value: User.currency, icon: <HandCoins size={20} /> },
    {
      label: "Email Verified",
      value: User.is_verified ? "Verified" : "Not Verified",
      icon: <Check size={20} />,
      isVerified: User.is_verified,
    },
  ];

  return (
    <div className="bg-gray-50 p-6 flex justify-center pt-16">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Avatar & Basic Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center relative">
          <div className="relative">
            <img
              src={User.avatar_url}
              alt="User Avatar"
              className="w-28 h-28 rounded-full border-4 border-green-500 shadow-md relative z-10 transition-transform duration-300 hover:scale-105"
            />
            {/* + Button Overlay */}
            <button
              onClick={handleAvatarClick}
              disabled={isUploading}
              className="absolute bottom-0 right-0 w-8 h-8 z-20 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md hover:bg-green-600 transition"
              title="Change Profile Picture"
            >
              +
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{User.username}</h2>
          <p className="text-gray-500">{User.email}</p>

          {/* Level Progress Bar */}
          <div className="mt-4 w-full">
            <span className="text-sm text-gray-600 font-medium">Level Progress</span>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
              <div
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${expPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Card: Stats & Actions */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 pt-4 pb-4 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {stats.map(({ label, value, icon, isVerified }) => (
              <div
                key={label}
                className={`flex flex-col bg-gray-50 p-3 rounded-lg shadow-sm items-center transition-transform hover:scale-105`}
              >
                <div className="flex items-center gap-1 mb-1">
                  {icon}
                  <span className="text-gray-600 text-sm font-medium">{label}</span>
                </div>
                <span
                  className={`text-gray-800 font-semibold mt-1 ${
                    isVerified ? (User.is_verified ? "text-green-600" : "text-red-600") : ""
                  }`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 max-w-xs py-2 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-shadow shadow-md"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
        {/* Modal Triggered Here */}
      <UpdateProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
