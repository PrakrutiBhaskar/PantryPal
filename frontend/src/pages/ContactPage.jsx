import React, { useState } from "react";
import toast from "react-hot-toast";
import backgroundImage from "../assets/background.jpg";

const API_URL = import.meta.env.VITE_API_URL;   // ✅ Use Render backend URL

const PALETTE = {
  cream: "#F2E3C6",
  tan: "#E7D2AC",
  brown: "#B57655",
  beige: "#F3D79E",
};

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error(data.message || "Failed to send");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="kanit-light min-h-screen flex items-center justify-center bg-[var(--cream)]"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="w-full max-w-3xl p-10 rounded-3xl shadow-2xl relative"
        style={{
          background: "rgba(255,255,255,0.8)",
          border: `1px solid ${PALETTE.tan}`,
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          className="absolute w-24 h-24 rounded-full opacity-40"
          style={{
            background: PALETTE.beige,
            top: "-30px",
            right: "-30px",
            filter: "blur(12px)",
          }}
        />

        <h1
          className="text-4xl font-bold text-center mb-6"
          style={{ color: PALETTE.brown }}
        >
          Contact Us 📬
        </h1>

        <p className="text-center text-gray-700 mb-10 max-w-md mx-auto">
          Have questions, feedback or need support?
          <br />We’d love to hear from you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold">Your Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              style={{
                borderColor: PALETTE.tan,
                background: "white",
              }}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              style={{
                borderColor: PALETTE.tan,
                background: "white",
              }}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="textarea textarea-bordered w-full h-32"
              style={{
                borderColor: PALETTE.tan,
                background: "white",
              }}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full text-white text-lg"
            style={{
              background: PALETTE.brown,
              borderColor: PALETTE.brown,
            }}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
