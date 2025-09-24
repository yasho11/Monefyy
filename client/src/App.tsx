// App.tsx
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";

// Pages
import { SignupPage } from "./pages/SingupPage";
import { LoginPage } from "./pages/LoginPage";
import { VerifyCode } from "./pages/VerifyCodePage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { Homepage } from "./pages/Homepage";
import { ProfilePage } from "./pages/ProfilePage";

// Components
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { VerifyBannerBottom } from "./components/VerifyBanner";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  const authPages = ["/login", "/signup", "/verify", "/reset-password"];
  const isAuthPage = authPages.includes(location.pathname);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
    };
    init();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-xl font-semibold">Loading... ⏳</h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Only show Sidebar if not on auth pages */}
      {authUser && !isAuthPage && (
        <Sidebar onToggle={(collapsed) => setIsSidebarCollapsed(collapsed)} />
      )}

      <main
        className={`flex-1 flex flex-col overflow-y-auto bg-gray-50 transition-all duration-300 ${
          authUser && !isAuthPage ? (isSidebarCollapsed ? "ml-20" : "ml-64") : ""
        }`}
      >
        {/* Only show Navbar if not on auth pages */}
        {authUser && !isAuthPage && (
          <Navbar
            pageTitle="Dashboard"
            onAddClick={() => console.log("Add clicked")}
          />
        )}

        <div
          className={`flex-1 ${
            authUser && !isAuthPage ? "pt-16 p-6 relative" : "p-6 flex items-center justify-center"
          }`}
        >
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify" element={<VerifyCode />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route
              path="/"
              element={authUser ? <Homepage /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
          </Routes>

          {/* Bottom verify banner */}
          {!isAuthPage && <VerifyBannerBottom />}
        </div>
      </main>
    </div>
  );
}

export default App;
