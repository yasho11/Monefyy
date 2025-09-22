import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link} from "react-router-dom";
import toast from "react-hot-toast";
import currencies from "../data/currencies.json";

interface FormData {
  username: string;
  email: string;
  password: string;
  currency: string;
  referral?: string;
}

export const SignupPage = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    currency: "USD",
    referral: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.username.trim()) return toast.error("Username is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 8) return toast.error("Password must be at least 8 characters");
    if (!/[a-z]/.test(formData.password)) return toast.error("Password must include at least 1 lowercase letter");
    if (!/[A-Z]/.test(formData.password)) return toast.error("Password must include at least 1 uppercase letter");
    if (!/[0-9]/.test(formData.password)) return toast.error("Password must include at least 1 number");
    if (!/[^A-Za-z0-9]/.test(formData.password)) return toast.error("Password must include at least 1 special character");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await signup(formData); // call your authStore signup
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <h1 className="text-2xl font-bold">Create Account</h1>
      <p className="text-base-content/60">Get your finance together</p>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        {/* Username */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Email */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="input input-bordered w-full"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-sm mt-1"
          >
            {showPassword ? "Hide" : "Show"} password
          </button>
        </div>

        {/* Currency */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Currency</span>
          </label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="select select-bordered w-full"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Referral */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Referral (optional)</span>
          </label>
          <input
            type="text"
            placeholder="Referral code"
            value={formData.referral}
            onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
            className="input input-bordered w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSigningUp}
        >
          {isSigningUp ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-2">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
};
