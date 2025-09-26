import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; // Show/hide icons
import { useNavigate } from "react-router-dom";

export const ResetPasswordPage = () => {
  const { resetPassword, isResetting } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.code.trim()) return toast.error("Reset code is required");
    if (!formData.newPassword.trim())
      return toast.error("New password is required");
    if (formData.newPassword.length < 8)
      return toast.error("Password must be at least 8 characters");

    await resetPassword(formData);
    navigate("/login"); // Redirect after successful reset
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Enter your email, reset code, and a new password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="input input-bordered w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 rounded-lg"
              required
            />
          </div>

          {/* Reset Code */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Reset Code
            </label>
            <input
              type="text"
              placeholder="Enter reset code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              className="input input-bordered w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 rounded-lg"
              required
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col relative">
            <label className="text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className="input input-bordered w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 rounded-lg pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg shadow-md transition"
            disabled={isResetting}
          >
            {isResetting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-5">
          Remember your password?{" "}
          <a
            href="/login"
            className="text-green-500 font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};
