import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Bakery Color Palette
const PALETTE = {
  beige: "#F3D79E",
  brown: "#B57655",
  cream: "#F7EEDB",
  tan: "#E7D2AC",
  nude: "#D0B79A",
  caramel: "#BA8C73",
  black: "#000000",
};

const LikedPage = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Remove liked
  const handleUnliked = async (id, e) => {
    e.stopPropagation();

    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Removed from liked");
        setRecipes((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error removing like");
    }
  };

  // Fetch liked recipes
  useEffect(() => {
    if (!token) return navigate("/signup");

    const fetchLiked = async () => {
      try {
        const res = await fetch(`${API_URL}/api/recipes/liked`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setRecipes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading liked recipes:", error);
      }
    };

    fetchLiked();
  }, []);

  return (
    <div
      className="kanit-light px-6 md:px-16 py-10"
      style={{ background: PALETTE.cream }}
    >
      {/* Page Title */}
      <h1
        className="text-4xl font-bold text-center mb-10"
        style={{ color: PALETTE.brown }}
      >
        ❤️ Liked Recipes
      </h1>

      {recipes.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-lg mb-4" style={{ color: PALETTE.caramel }}>
            You haven’t liked any recipes yet.
          </p>

          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 rounded-xl shadow"
            style={{
              background: PALETTE.brown,
              color: "white",
              border: `1px solid ${PALETTE.tan}`,
            }}
          >
            Explore Recipes 🍳
          </button>
        </div>
      ) : (
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              onClick={() => navigate(`/recipe/${recipe._id}`)}
              className="rounded-2xl shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
              style={{
                background: "white",
                border: `1px solid ${PALETTE.tan}`,
              }}
            >
              {/* Image */}
              <img
                src={
                  recipe.images?.length
                    ? `${API_URL}/${recipe.images[0]}`
                    : "/no-image.png"
                }
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />

              {/* Body */}
              <div className="p-5">
                <h3
                  className="text-xl font-semibold truncate mb-2"
                  style={{ color: PALETTE.brown }}
                >
                  {recipe.title}
                </h3>

                <p className="text-sm opacity-80 line-clamp-2">
                  {recipe.ingredients}
                </p>

                <p className="mt-3 text-sm opacity-80">
                  👍 {recipe.likes} likes
                </p>

                {/* Remove Button */}
                <button
                  onClick={(e) => handleUnliked(recipe._id, e)}
                  className="mt-4 px-4 py-2 rounded-xl text-white"
                  style={{ background: "#C62828" }}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedPage;
