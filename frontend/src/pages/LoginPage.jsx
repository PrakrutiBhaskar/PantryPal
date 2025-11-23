// LoginPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import backgroundImage from "../assets/background.jpg"
const PALETTE = {
  beige: "#F3D79E",
  brown: "#B57655",
  cream: "#F2E3C6",
  tan: "#E7D2AC",
  nude: "#D0B79A",
  black: "#000000",
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/home");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ _id: data._id, name: data.name, email: data.email })
        );
        window.dispatchEvent(new Event("storage"));
        toast.success(`Welcome back, ${data.name || "friend"}!`);
        navigate("/home");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kanit-light min-h-screen flex items-center justify-center bg-[var(--cream)]" style={{ backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
 }}>
      <div className="w-full max-w-6xl mx-4 md:mx-0 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* LEFT: Form */}
        <div className="p-8 md:p-12 bg-white">
          <h2 className="text-3xl font-bold mb-2" style={{ color: PALETTE.brown }}>
            Sign In
          </h2>
          <p className="text-sm text-gray-600 mb-6">Or use your email password</p>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="input input-bordered w-full"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderColor: PALETTE.tan }}
              required
            />
            <input
              className="input input-bordered w-full"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderColor: PALETTE.tan }}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="underline" style={{ color: PALETTE.brown }}>
                Forgot Password?
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-lg text-white"
                style={{ background: PALETTE.brown }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-sm text-gray-600">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold" style={{ color: PALETTE.brown }}>
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT: Welcome panel */}
        <div
          className="relative hidden md:flex items-center justify-center p-8"
          style={{
            background: PALETTE.nude,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full h-full rounded-l-2xl flex items-center justify-center">
            <div className="p-8 max-w-sm text-center text-white backdrop-blur-sm" style={{ textShadow: "0 3px 10px rgba(0,0,0,0.12)" }}>
              <h3 className="text-3xl font-bold mb-2">Hello, Friend!</h3>
              <p className="mb-6">Register with your personal details to use all of our site features</p>
              <Link to="/signup" className="inline-block px-6 py-2 rounded-full border" style={{ background: "transparent", color: "white", borderColor: "rgba(255,255,255,0.35)" }}>
                SIGN UP
              </Link>
            </div>
          </div>

          {/* curved overlay (right-side rounded cut) */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute right-0 top-0 h-full w-12 fill-white" style={{ opacity: 0.05 }}>
            <path d="M0,0 C40,50 40,50 0,100 L100,100 L100,0 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
