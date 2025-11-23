// SignUpPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import backgroundImage from "../assets/background.jpg";

const API_URL = import.meta.env.VITE_API_URL;

const PALETTE = {
  beige: "#F3D79E",
  brown: "#B57655",
  cream: "#F2E3C6",
  tan: "#E7D2AC",
  nude: "#D0B79A",
  black: "#000000",
};

const SignUpPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirm) {
      toast.error("Please fill all fields");
      return;
    }

    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token + user
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(
            data.user || {
              _id: data._id,
              name: data.name,
              email: data.email,
            }
          )
        );

        window.dispatchEvent(new Event("storage"));
        toast.success(`Welcome to PantryPal, ${data.name}!`);
        navigate("/home");
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
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
      <div className="w-full max-w-6xl mx-4 md:mx-0 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* LEFT: Welcome Panel */}
        <div
          className="relative hidden md:flex items-center justify-center p-8"
          style={{
            background: PALETTE.nude,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="p-8 max-w-sm text-center text-white backdrop-blur-sm"
            style={{ textShadow: "0 3px 10px rgba(0,0,0,0.12)" }}
          >
            <h3 className="text-3xl font-bold mb-2">Welcome!</h3>
            <p className="mb-6">
              Sign up and join the PantryPal community — save, like & share your
              favourite recipes.
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-2 rounded-full border"
              style={{
                background: "transparent",
                color: "white",
                borderColor: "rgba(255,255,255,0.35)",
              }}
            >
              SIGN IN
            </Link>
          </div>

          {/* Curved right overlay */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute right-0 top-0 h-full w-12 fill-white"
            style={{ opacity: 0.05 }}
          >
            <path d="M0,0 C40,50 40,50 0,100 L100,100 L100,0 Z" />
          </svg>
        </div>

        {/* RIGHT: Sign Up Form */}
        <div className="p-8 md:p-12 bg-white">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: PALETTE.brown }}
          >
            Create Account
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Register with your personal details
          </p>

          <form className="space-y-4" onSubmit={handleCreate}>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="input input-bordered w-full"
              placeholder="Full name"
              style={{ borderColor: PALETTE.tan }}
              required
            />

            <input
              name="email"
              value={form.email}
              onChange={onChange}
              className="input input-bordered w-full"
              placeholder="Email address"
              style={{ borderColor: PALETTE.tan }}
              type="email"
              required
            />

            <input
              name="password"
              value={form.password}
              onChange={onChange}
              className="input input-bordered w-full"
              placeholder="Password"
              style={{ borderColor: PALETTE.tan }}
              type="password"
              required
            />

            <input
              name="confirm"
              value={form.confirm}
              onChange={onChange}
              className="input input-bordered w-full"
              placeholder="Confirm password"
              style={{ borderColor: PALETTE.tan }}
              type="password"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg text-white w-full"
              style={{ background: PALETTE.brown }}
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-600">
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold"
                style={{ color: PALETTE.brown }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
