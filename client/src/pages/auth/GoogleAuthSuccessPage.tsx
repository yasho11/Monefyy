import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const loginWithGoogle = async () => {
      // This will call your backend, which reads JWT from the cookie
      await checkAuth();

      // Redirect user to dashboard
      navigate("/");
    };

    loginWithGoogle().catch(() => {
      // Fallback if something goes wrong
      navigate("/login");
    });
  }, [checkAuth, navigate]);

  return <div>Logging in with Google...</div>;
};
