// LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // optional: redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/");
  }, [navigate]);

  const handleLogin = async (e) => {
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
        // backend returns { user, token }
        toast.success(`Welcome back, ${data.name}!`);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email
        }))
        window.dispatchEvent(new Event("storage"));
        navigate("/home");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app flex items-center justify-center bg-[#F2E3C6]">
  <div className="w-full max-w-md  bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-lg border border-[#e7d8c9]">
     <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input input-bordered w-full" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered w-full" required />
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>

      <div className="mt-4 text-center">
        <p className="mb-2">Don't have an account?</p>
        <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
