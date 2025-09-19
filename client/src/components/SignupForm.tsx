import { useState } from "react";
import { registerUser } from "../libs/auth";
import type { RegisterData } from "../libs/auth";
import { useUserStore } from "../store/userStore";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);

  const setUser = useUserStore((state) => state.setUser);
  const notifyError = useUserStore((state) => state.notifyError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: RegisterData = { username, email, password, currency, referralCode };
      const user = await registerUser(data);

      // Save user in Zustand and show success toast
      setUser(user, `Account created successfully! Welcome ${user.username}`);
      console.log("User stored in Zustand:", user);
    } catch (err: any) {
      // Check if backend sent validation errors array
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        notifyError(err.response.data.errors[0].msg); // show first error
        console.log("Validation errors:", err.response.data.errors);
      } else {
        notifyError(err.response?.data?.message || "Something went wrong");
        console.log("Validation errors:", err.response.data.errors);

      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        className="w-full p-2 border rounded mb-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="w-full p-2 border rounded mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Currency (USD, EUR, etc.)"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        required
      />

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Referral Code (optional)"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full p-2 bg-blue-500 text-white font-bold rounded"
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
