// SignUpPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
        try {
    const res = await fetch("http://localhost:5001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    console.log("🔍 Response:", data, "Status:", res.status);

    if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage"));
        toast.success("Account created successfully!");
        navigate("/home");
    } else {
        alert(data.message || "Signup failed");
    }
    } catch (err) {
    console.error("Signup error:", err);
    alert("Something went wrong!");
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app flex items-center justify-center bg-[#F2E3C6]">
  <div className="w-full max-w-md  bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-lg border border-[#e7d8c9]">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered w-full" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input input-bordered w-full" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered w-full" required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input input-bordered w-full" required />
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Creating..." : "Sign Up"}</button>
      </form>

      <div className="mt-4 text-center">
        <p className="mb-2">Already have an account?</p>
        <Link to="/login" className="btn btn-secondary">Login</Link>
      </div>
    </div>
  </div>
  );
};

export default SignUpPage;
