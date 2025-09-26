// App.tsx
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";

// Pages
import { SignupPage } from "./pages/auth/SingupPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { VerifyCode } from "./pages/auth/VerifyCodePage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { Homepage } from "./pages/dashboard/Homepage";
import { ProfilePage } from "./pages/dashboard/ProfilePage";

// Components
import Sidebar from "./components/layouts/Sidebar";
import Navbar from "./components/layouts/Navbar";
import { VerifyBannerBottom } from "./components/auth/VerifyBanner";
import { GoogleAuthSuccess } from "./pages/auth/GoogleAuthSuccessPage";
import { TransactionsPage } from "./pages/Transaction/TransactionPage";



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
            <Route path="/auth/success" element={<GoogleAuthSuccess/>}/>
            <Route
              path="/"
              element={authUser ? <Homepage /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/transaction"
              element={authUser ? <TransactionsPage /> : <Navigate to="/login" />}
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
