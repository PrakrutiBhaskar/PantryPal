import React, { useState } from "react";
import toast from "react-hot-toast";
import backgroundImage from "../assets/background.jpg";

const API_URL = import.meta.env.VITE_API_URL; // ✅ Production backend URL

const PALETTE = {
  cream: "#F2E3C6",
  tan: "#E7D2AC",
  brown: "#B57655",
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Reset link sent to your email!");
        setEmail("");
      } else {
        toast.error(data.message || "Unable to send reset link");
      }
    } catch (err) {
      toast.error("Server error. Try again later.");
      console.error("❌ Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="kanit-light min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="w-full max-w-md p-8 rounded-xl shadow-xl backdrop-blur-md"
        style={{
          background: "rgba(255,255,255,0.7)",
          border: `1px solid ${PALETTE.tan}`,
        }}
      >
        <h1
          className="text-3xl font-bold text-center mb-5"
          style={{ color: PALETTE.brown }}
        >
          Forgot Password
        </h1>

        <p className="text-center mb-4 text-gray-700">
          Enter your email and we will send you a reset link.
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
            style={{ borderColor: PALETTE.tan }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="btn w-full text-white"
            style={{ background: PALETTE.brown, borderColor: PALETTE.brown }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center mt-4">
          <a
            href="/login"
            style={{ color: PALETTE.brown }}
            className="underline"
          >
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
