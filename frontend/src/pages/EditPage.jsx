import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// ✅ Always use deployed backend URL from env
const API_URL = import.meta.env.VITE_API_URL;

// Bakery UI Palette
const PALETTE = {
  beige: "#F3D79E",
  brown: "#B57655",
  cream: "#F7EEDB",
  tan: "#E7D2AC",
  nude: "#D0B79A",
  caramel: "#BA8C73",
  black: "#000000",
};

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    steps: "",
    cuisine: "",
    dietType: "",
    cookingTime: "",
  });

  // Fetch recipe details
  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}`);
      const data = await res.json();

      if (res.ok) {
        setFormData({
          title: data.title,
          ingredients: Array.isArray(data.ingredients)
            ? data.ingredients.join(", ")
            : data.ingredients,
          steps: Array.isArray(data.steps)
            ? data.steps.join(". ")
            : data.steps,
          cuisine: data.cuisine || "",
          dietType: data.dietType || "",
          cookingTime: data.cookingTime || "",
        });
      } else {
        toast.error("Recipe not found");
        navigate("/myrecipes");
      }
    } catch (err) {
      toast.error("Server error while loading recipe");
    }
  };

  // Handle changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Update recipe
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("You must log in first!");
      return navigate("/login");
    }

    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Recipe updated successfully!");
        navigate(`/recipe/${id}`);
      } else {
        toast.error(data.message || "Failed to update recipe");
      }
    } catch (err) {
      toast.error("Server error while updating");
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
        {/* Title */}
        <h2
          className="text-4xl font-bold text-center mb-6"
          style={{ color: PALETTE.brown }}
        >
          Edit Recipe ✏️
        </h2>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 rounded-xl shadow"
          style={{
            background: PALETTE.beige,
            color: PALETTE.brown,
            border: `1px solid ${PALETTE.tan}`,
          }}
        >
          ← Back
        </button>

        {/* Form */}
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
              <option value="">Select Diet</option>
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
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{ border: `1px solid ${PALETTE.tan}`, background: "white" }}
            />
          </div>

          {/* Update Button */}
          <button
            type="submit"
            className="py-3 text-lg rounded-xl shadow-md"
            style={{ background: PALETTE.brown, color: "white" }}
          >
            Update Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;
