import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import backgroundImage from "../assets/background.jpg";

const API_URL = import.meta.env.VITE_API_URL; // ✅ Render-safe

const PALETTE = {
  cream: "#F2E3C6",
  tan: "#E7D2AC",
  brown: "#B57655",
  beige: "#F3D79E",
};

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/users/reset-password/${token}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successful! 🎉");
        navigate("/login");
      } else {
        toast.error(data.message || "Invalid or expired link");
      }
    } catch (err) {
      toast.error("Server error. Try again later.");
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
        className="p-10 w-full max-w-lg rounded-3xl shadow-2xl relative"
        style={{
          background: "rgba(255,255,255,0.7)",
          border: `1px solid ${PALETTE.tan}`,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Decorative circle */}
        <div
          className="absolute w-24 h-24 rounded-full opacity-40"
          style={{
            background: PALETTE.beige,
            top: "-30px",
            right: "-30px",
            filter: "blur(8px)",
          }}
        ></div>

        <h1
          className="text-3xl font-bold text-center mb-6"
          style={{ color: PALETTE.brown }}
        >
          Reset Your Password 🔐
        </h1>

        <p className="text-center mb-6 text-gray-700">
          Create a new password to regain access to your account.
        </p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* New Password */}
          <div>
            <label className="font-semibold mb-1 block">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="input input-bordered w-full"
              style={{
                borderColor: PALETTE.tan,
                background: "white",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-semibold mb-1 block">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="input input-bordered w-full"
              style={{
                borderColor: PALETTE.tan,
                background: "white",
              }}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            className="btn w-full text-white mt-4"
            style={{
              background: PALETTE.brown,
              borderColor: PALETTE.brown,
            }}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-center mt-6">
          <a
            href="/login"
            className="underline"
            style={{ color: PALETTE.brown }}
          >
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
