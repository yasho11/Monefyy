import { useAuthStore } from "../store/useAuthStore";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export const VerifyCode = () => {
  const { verifyCode, isVerifying, authUser } = useAuthStore();
  const navigate = useNavigate();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return; // Only allow one character
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move focus to next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCode = code.join("");
    if (finalCode.length !== 6) return;

    const success = await verifyCode({ code: finalCode });
    if (success) {
      navigate("/"); // Redirect to home after successful verification
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Verify Your Account</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Enter the 6-character verification code sent to your email
          </p>
          {authUser?.email && (
            <p className="text-gray-700 mt-2 text-sm">
              Verification email sent to <strong>{authUser.email}</strong>, please check your email.
            </p>
          )}
        </div>

        {/* Code Inputs */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex justify-between gap-3">
            {code.map((char, idx) => (
              <input
                key={idx}
                ref={(el) => void (inputsRef.current[idx] = el)}
                type="text"
                maxLength={1}
                value={char}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="border-1 border-gray-500 text-center w-12 h-12 text-lg font-semibold focus:ring-2 focus:ring-green-400 rounded-lg"
                required
              />
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg shadow-md transition"
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>

          {/* Skip */}
          <p className="text-center text-gray-500 text-sm mt-2">
            <Link to="/" className="text-green-500 font-medium hover:underline">
              Skip for now...
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
