import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { X } from "lucide-react";


export const VerifyBannerBottom = () => {
  const { authUser, sendVerificationMail } = useAuthStore();
  const [visible, setVisible] = useState(true);

  // Do not show if user is verified or banner dismissed
  if (!authUser || authUser.is_verified || !visible) return null;

  const sentVerification = () => {
    const userId = authUser.id;
    sendVerificationMail(userId);
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-red-100/30 backdrop-blur-sm text-red-700 rounded-lg shadow-lg flex items-center justify-between px-4 py-3 z-50">
      <p className="text-sm">
        Your account is not verified.{" "}
          <a
                href="/verify"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-red-800"
                onClick={sentVerification}
            >
                Verify now
            </a>
      </p>
      <button
        onClick={() => setVisible(false)}
        className="text-red-700 hover:text-red-900 ml-4"
      >
        <X size={16} />
      </button>
    </div>
  );
};
