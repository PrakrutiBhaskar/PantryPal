import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const PALETTE = {
  beige: "#F3D79E",
  brown: "#B57655",
  cream: "#F7EEDB",
  tan: "#E7D2AC",
  nude: "#D0B79A",
  caramel: "#BA8C73",
  black: "#000000",
};

// ✅ Safe JSON parse helper
const safeJson = async (res) => {
  const text = await res.text();
  return text ? JSON.parse(text) : {};
};

const CreatePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    steps: "",
    cuisine: "",
    dietType: "",
    cookingTime: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ Added loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to create a recipe.");
      return navigate("/login");
    }

    if (!formData.title.trim() || !formData.ingredients.trim() || !formData.steps.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true); // ✅ Set loading before request

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        formDataToSend.append(key, value)
      );
      images.forEach((img) => formDataToSend.append("images", img));

      const res = await fetch(`${API_URL}/api/recipes`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const data = await safeJson(res); // ✅ Safe parse

      if (res.ok) {
        toast.success("Recipe created successfully! 🍳");
        navigate("/home");
      } else {
        toast.error(data.message || "Failed to create recipe.");
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false); // ✅ Always reset loading
    }
  };

  return (
    <div
      className="kanit-light min-h-screen flex justify-center px-4 py-16"
      style={{ background: PALETTE.cream }}
    >
      <div
        className="w-full max-w-3xl shadow-xl rounded-2xl p-10"
        style={{
          background: "var(--card, white)",
          border: `1px solid ${PALETTE.tan}`,
        }}
      >
        <h2
          className="text-4xl font-bold text-center mb-6"
          style={{ color: PALETTE.brown }}
        >
          Create a New Recipe 🍽️
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title */}
          <div>
            <label className="block mb-1 font-semibold" style={{ color: PALETTE.brown }}>
              Recipe Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Creamy Pasta"
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{ border: `1px solid ${PALETTE.tan}`, background: "white" }}
              required
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="block mb-1 font-semibold" style={{ color: PALETTE.brown }}>
              Ingredients *
            </label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="List ingredients separated by commas"
              rows={3}
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{ border: `1px solid ${PALETTE.tan}`, background: "white" }}
              required
            ></textarea>
          </div>

          {/* Steps */}
          <div>
            <label className="block mb-1 font-semibold" style={{ color: PALETTE.brown }}>
              Preparation Steps *
            </label>
            <textarea
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              placeholder="Describe step-by-step instructions"
              rows={5}
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{ border: `1px solid ${PALETTE.tan}`, background: "white" }}
              required
            ></textarea>
          </div>

          {/* Cuisine */}
          <div>
            <label className="block mb-1 font-semibold" style={{ color: PALETTE.brown }}>
              Cuisine
            </label>
            <input
              type="text"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              placeholder="e.g., Italian, Indian, Chinese"
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{ border: `1px solid ${PALETTE.tan}`, background: "white" }}
            />
          </div>

          {/* Diet Type */}
          <div>
            <label className="block mb-1 font-semibold" style={{ color: PALETTE.brown }}>
              Diet Type
            </label>
            <select
              name="dietType"
              value={formData.dietType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{ border: `1px solid ${PALETTE.tan}`, background: "white" }}
            >
              <option value="">Select one</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Keto">Keto</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </div>

          {/* Cooking Time */}
          <div>
            <label className="block mb-1 font-semibold" style={{ color: PALETTE.brown }}>
              Cooking Time (mins)
            </label>
            <input
              type="number"
              name="cookingTime"
              value={formData.cookingTime}
              onChange={handleChange}
              placeholder="e.g., 30"
              min="1"
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{ border: `1px solid ${PALETTE.tan}`, background: "white" }}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-semibold" style={{ color: PALETTE.brown }}>
              Upload Recipe Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-4 py-3 rounded-xl cursor-pointer"
              style={{ border: `1px solid ${PALETTE.tan}`, background: "white" }}
            />
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  className="rounded-xl w-full h-40 object-cover border shadow"
                  style={{ borderColor: PALETTE.tan }}
                  alt="preview"
                />
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 py-3 text-lg rounded-xl shadow-md"
            style={{
              background: PALETTE.brown,
              color: "white",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Submitting..." : "Submit Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
