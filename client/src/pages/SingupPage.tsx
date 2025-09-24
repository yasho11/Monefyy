import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import currencies from "../data/currencies.json";
import { Eye, EyeOff, HelpCircle } from "lucide-react";
import GoogleLogo from "../assets/google.png";

interface FormData {
  username: string;
  email: string;
  password: string;
  currency: string;
  referral?: string;
}

export const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    currency: "USD",
    referral: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const { signup, isSigningUp, googleLogin } = useAuthStore();

  const validateForm = () => {
    if (!formData.username.trim()) return toast.error("Username is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 8)
      return toast.error("Password must be at least 8 characters");
    if (!/[a-z]/.test(formData.password))
      return toast.error("Password must include at least 1 lowercase letter");
    if (!/[A-Z]/.test(formData.password))
      return toast.error("Password must include at least 1 uppercase letter");
    if (!/[0-9]/.test(formData.password))
      return toast.error("Password must include at least 1 number");
    if (!/[^A-Za-z0-9]/.test(formData.password))
      return toast.error("Password must include at least 1 special character");
    if (formData.password !== confirmPassword)
      return toast.error("Passwords do not match");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await signup(formData);
      navigate("/verify");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-12 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Get your finance together with Monefyy
          </p>
        </div>

        {/* Google OAuth */}
        <button
          onClick={googleLogin}
          className="flex items-center justify-center gap-2 w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          <img src={GoogleLogo} alt="Google" className="w-5 h-5" />
          Sign up with Google
        </button>

        <div className="flex items-center gap-4">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="input input-bordered w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 rounded-lg py-2"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="input input-bordered w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 rounded-lg py-2"
              required
            />
          </div>

          {/* Password + Confirm Password */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col relative">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                Password
                <div className="relative group">
                  <HelpCircle
                    size={16}
                    className="text-gray-400 cursor-pointer"
                  />
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Password must contain:
                    <ul className="list-disc ml-4 mt-1">
                      <li>At least 8 characters</li>
                      <li>1 uppercase letter</li>
                      <li>1 lowercase letter</li>
                      <li>1 number</li>
                      <li>1 special character</li>
                    </ul>
                  </div>
                </div>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input input-bordered w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 rounded-lg pr-10 py-2"
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

            <div className="flex-1 flex flex-col relative">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-bordered w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 rounded-lg pr-10 py-2"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Currency + Referral */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="select select-bordered w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 rounded-lg py-2"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Referral (optional)
              </label>
              <input
                type="text"
                placeholder="Referral code"
                value={formData.referral}
                onChange={(e) =>
                  setFormData({ ...formData, referral: e.target.value })
                }
                className="input input-bordered w-full focus:ring-2 focus:ring-green-400 focus:border-green-400 rounded-lg py-2"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg shadow-md transition"
            disabled={isSigningUp}
          >
            {isSigningUp ? "Signing up..." : "Sign Up"}
          </button>
        </form>
                {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-3">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-500 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

