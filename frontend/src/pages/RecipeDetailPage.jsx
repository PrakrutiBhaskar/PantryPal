import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecipe = async () => {
    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}`);
      const data = await safeJson(res); // ✅ Safe parse

      if (!res.ok) {
        toast.error(data.message || "Error loading recipe");
        navigate("/home");
        return;
      }

      setRecipe(data.recipe || data);
    } catch (err) {
      console.error("Error fetching recipe:", err);
      toast.error("Failed to load recipe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]); // ✅ id in dependency array

  const handleLike = async () => {
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await safeJson(res); // ✅ Safe parse

      if (res.ok) {
        toast.success(data.message || "Liked!");
        fetchRecipe();
      } else {
        toast.error(data.message || "Failed to like recipe");
      }
    } catch (err) {
      console.error("Error liking recipe:", err);
      toast.error("Error liking recipe");
    }
  };

  const handleFavorite = async () => {
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}/favorite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await safeJson(res); // ✅ Safe parse

      if (res.ok) {
        toast.success(data.message || "Updated favorites");
        fetchRecipe();
      } else {
        toast.error(data.message || "Failed to update favorites");
      }
    } catch (err) {
      console.error("Error favoriting recipe:", err);
      toast.error("Error favoriting recipe");
    }
  };

  if (loading)
    return (
      <div
        className="kanit-light flex justify-center items-center min-h-screen text-xl"
        style={{ color: PALETTE.brown }}
      >
        Loading recipe…
      </div>
    );

  if (!recipe)
    return (
      <p className="kanit-light text-center mt-10" style={{ color: PALETTE.brown }}>
        Recipe not found.
      </p>
    );

  const images = recipe.images?.length ? recipe.images : ["no-image.png"];

  return (
    <div
      className="kanit-light max-w-5xl mx-auto p-6"
      style={{ background: PALETTE.cream }}
    >
      {/* Back Button */}
      <button
        className="px-5 py-2 rounded-xl shadow mb-5"
        onClick={() => navigate("/home")}
        style={{
          background: PALETTE.beige,
          color: PALETTE.brown,
          border: `1px solid ${PALETTE.tan}`,
        }}
      >
        ← Back to Home
      </button>

      {/* Title */}
      <h1
        className="text-4xl font-bold mb-4"
        style={{ color: PALETTE.brown }}
      >
        {recipe.title}
      </h1>

      {/* Image Carousel */}
      <div
        className="carousel w-full rounded-2xl shadow-xl mb-10"
        style={{ border: `1px solid ${PALETTE.tan}` }}
      >
        {images.map((img, index) => (
          <div
            id={`slide${index}`}
            key={index}
            className="carousel-item relative w-full"
          >
            <img
              src={
                img.startsWith("http")
                  ? img
                  : `${API_URL}/${img.replace(/\\/g, "/")}`
              }
              className="w-full object-cover max-h-[500px]"
              alt={`Recipe image ${index + 1}`}
            />

            {/* Only show nav arrows if multiple images */}
            {images.length > 1 && (
              <div className="absolute flex justify-between left-5 right-5 top-1/2 -translate-y-1/2">
                <a
                  href={`#slide${index === 0 ? images.length - 1 : index - 1}`}
                  className="btn btn-circle"
                >
                  ❮
                </a>
                <a
                  href={`#slide${index === images.length - 1 ? 0 : index + 1}`}
                  className="btn btn-circle"
                >
                  ❯
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Like + Favorite + Author */}
      <div className="flex flex-wrap items-center gap-6 mb-10 text-xl">
        <button
          className="flex items-center gap-2"
          onClick={handleLike}
          style={{ color: PALETTE.caramel }}
        >
          ❤️ {recipe.likes || 0}
        </button>

        <button
          onClick={handleFavorite}
          style={{ color: PALETTE.brown }}
          className="flex items-center gap-2"
        >
          ⭐ Favorite
        </button>

        <p className="text-md" style={{ color: PALETTE.brown }}>
          👨‍🍳 Created by{" "}
          <strong style={{ color: PALETTE.black }}>
            {recipe.user?.name || "Anonymous"}
          </strong>
        </p>
      </div>

      {/* Ingredients + Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div
          className="p-6 rounded-xl shadow-md"
          style={{ background: "white", border: `1px solid ${PALETTE.tan}` }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: PALETTE.brown }}>
            Ingredients 🧂
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {Array.isArray(recipe.ingredients)
              ? recipe.ingredients.join(", ")
              : recipe.ingredients || "No ingredients listed"}
          </p>
        </div>

        <div
          className="p-6 rounded-xl shadow-md"
          style={{ background: "white", border: `1px solid ${PALETTE.tan}` }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: PALETTE.brown }}>
            Steps 👨‍🍳
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {recipe.steps || "No steps provided"}
          </p>
        </div>
      </div>

      {/* Extra Details */}
      <div
        className="p-6 rounded-xl shadow-md mt-10"
        style={{ background: "white", border: `1px solid ${PALETTE.tan}` }}
      >
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: PALETTE.brown }}
        >
          Recipe Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <p>
            <strong style={{ color: PALETTE.caramel }}>Cuisine:</strong>{" "}
            {recipe.cuisine || "Not specified"}
          </p>
          <p>
            <strong style={{ color: PALETTE.caramel }}>Diet:</strong>{" "}
            {recipe.dietType || "Not specified"}
          </p>
          <p>
            <strong style={{ color: PALETTE.caramel }}>Cooking Time:</strong>{" "}
            {recipe.cookingTime ? `${recipe.cookingTime} mins` : "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
