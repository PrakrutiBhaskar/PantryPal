import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ✅ Always use Render backend URL
const API_URL = import.meta.env.VITE_API_URL;

// Bakery Palette
const PALETTE = {
  beige: "#F3D79E",
  brown: "#B57655",
  cream: "#F7EEDB",
  tan: "#E7D2AC",
  nude: "#D0B79A",
  caramel: "#BA8C73",
  black: "#000000",
};

const Favorites = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API_URL}/api/recipes/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ❌ Token invalid → logout user
      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setRecipes(data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load favorites");
      console.error("❌ Error fetching favorites:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchFavorites();
  }, []);

  const handleUnfavorite = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}/favorite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Removed from favorites");
        setRecipes((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error(data.message || "Failed to update favorite");
      }
    } catch (error) {
      toast.error("Error removing favorite");
    }
  };

  if (loading) {
    return (
      <div
        className="kanit-light flex justify-center items-center min-h-screen text-xl"
        style={{ color: PALETTE.brown }}
      >
        Loading favorites…
      </div>
    );
  }

  return (
    <div
      className="kanit-light px-6 md:px-16 py-10"
      style={{ background: PALETTE.cream }}
    >
      {/* Title */}
      <h1
        className="text-4xl font-bold text-center mb-10"
        style={{ color: PALETTE.brown }}
      >
        ⭐ Your Favorite Recipes
      </h1>

      {recipes.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-lg mb-4" style={{ color: PALETTE.caramel }}>
            You haven’t favorited any recipes yet.
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
            Browse Recipes 🍽️
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
              className="rounded-2xl shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
              style={{ background: "white", border: `1px solid ${PALETTE.tan}` }}
            >
              {/* Image */}
              <img
                src={
                  recipe.images?.length
                    ? `${API_URL}/${recipe.images[0].replace(/\\/g, "/")}`
                    : "/no-image.png"
                }
                alt={recipe.title}
                className="w-full h-48 object-cover"
                onClick={() => navigate(`/recipe/${recipe._id}`)}
              />

              {/* Body */}
              <div className="p-5">
                <h3
                  className="text-xl font-semibold truncate mb-2 cursor-pointer"
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                  style={{ color: PALETTE.brown }}
                >
                  {recipe.title}
                </h3>

                <p className="text-sm opacity-80 mb-3">
                  {recipe.ingredients?.slice(0, 80)}...
                </p>

                {/* Buttons */}
                <div className="flex justify-between items-center mt-4">
                  {/* Remove Button */}
                  <button
                    onClick={() => handleUnfavorite(recipe._id)}
                    className="px-3 py-2 text-white rounded-xl"
                    style={{ background: "#C62828" }}
                  >
                    ❌ Remove
                  </button>

                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                    className="px-3 py-2 rounded-xl text-white"
                    style={{ background: PALETTE.brown }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
