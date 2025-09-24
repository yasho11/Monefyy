import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export const Homepage = () => {
  const {  isLoggingout, authUser, isCheckingAuth} = useAuthStore();
  const navigate = useNavigate();

  // Redirect to login if user logs out
  useEffect(() => {
    if (isLoggingout) {
      navigate("/login");
    }
  }, [isLoggingout, navigate]);

  

  if (!authUser || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-gray-500 text-lg">Loading user data...</h2>
      </div>
    );
  }
  console.log("Homepage authuser: " , authUser);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-2">
          Welcome, {authUser.username}!
        </h2>
        <p className="text-gray-600">
          Current tier: <span className="font-medium">{authUser.tier}</span>
        </p>
        <p className="text-gray-600">
          Level: <span className="font-medium">{authUser.level}</span>
        </p>
        <p className="text-gray-600">
          EXP Points: <span className="font-medium">{authUser.exp_points}</span>
        </p>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 text-gray-500 border-t">
        &copy; {new Date().getFullYear()} Monefyy. All rights reserved.
      </footer>
    </div>
  );
};
