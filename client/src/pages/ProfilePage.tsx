import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const { authUser, logout, getUserInfo, isCheckingAuth, userInfo, isGettingInfo } = useAuthStore();
  const navigate = useNavigate();

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

  return (
    <div className=" bg-gray-50 p-6 flex justify-center pt-16">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Avatar & Basic Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
          <img
            src={User.avatar_url}
            alt="User Avatar"
            className="w-28 h-28 rounded-full border-4 border-green-500 shadow-md"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{User.username}</h2>
          <p className="text-gray-500">{User.email}</p>
        </div>

        {/* Right Card: Stats & Actions */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 pt-4 pb-4 space-y-4">
          {/* Stats */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ["Subscription", User.subscription ?? "-"],
              ["Tier", User.tier ?? "-"],
              ["Level", User.level ?? "-"],
              ["Streak", `${User.streak ?? "-"} days`],
              ["Currency", User.currency],
              [
                "Email Verified",
                User.is_verified ? (
                  <span className="text-green-600 font-medium">Verified</span>
                ) : (
                  <span className="text-red-600 font-medium">Not Verified</span>
                ),
              ],
            ].map(([label, value]) => (
              <div
                key={label as string}
                className="flex flex-col bg-gray-50 p-3 rounded-lg shadow-sm items-center"
              >
                <span className="text-gray-600 text-sm font-medium">{label}</span>
                <span className="text-gray-800 font-semibold mt-1">{value}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3 mt-4 justify-center">
            <button
              onClick={() => navigate("/update-profile")}
              className="flex-1 py-2 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-shadow shadow-md"
            >
              Update Profile
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex-1 py-2 px-4 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-shadow shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
