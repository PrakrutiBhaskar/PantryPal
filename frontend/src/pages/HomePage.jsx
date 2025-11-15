import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch all recipes
  const fetchRecipes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/recipes`);
      const data = await res.json();

      setRecipes(data.recipes || data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching recipes:", error);
      toast.error("Failed to load recipes");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Like a recipe
  const handleLike = async (id) => {
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        fetchRecipes(); // refresh likes
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error liking recipe");
    }
  };

  // Favorite a recipe
  const handleFavorite = async (id) => {
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}/favorite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error favoriting recipe");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        Loading recipes...
      </div>
    );
  }

  return (
    <div className="px-5 md:px-16 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
        Discover Delicious Recipes 🍽️
      </h1>
      <div className="flex justify-center mb-10">
      <button
        onClick={() => navigate("/search")}
        className="btn btn-primary btn-lg px-6 shadow-md"
      >
        🔍 Search Recipes
      </button>
    </div>


      {/* Discover Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-yellow-300 p-6 rounded-2xl shadow-lg mb-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-2">Discover New Recipes</h2>
        <p className="text-lg">
          Explore trending dishes, try new cuisines, and save your favorites!
        </p>
      </div>

      {/* Recipe Cards */}
      <div
        className="grid gap-6 sm:gap-8"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
      >
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="border rounded-lg shadow-md bg-white hover:shadow-xl transition cursor-pointer overflow-hidden"
          >
            {/* Image */}
                      <img
            src={
              recipe.images && recipe.images.length > 0
                ? `${API_URL}/${recipe.images[0]}`
                : "https://via.placeholder.com/400x300?text=No+Image"
            }
            alt={recipe.title}
            className="w-full h-48 object-cover rounded-md"
          />


            {/* Card Body */}
            <div className="p-4">
              <h3
                className="text-xl font-semibold text-gray-800 truncate"
                onClick={() => navigate(`/recipe/${recipe._id}`)}
              >
                {recipe.title}
              </h3>

              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {recipe.ingredients || "No ingredients listed"}
              </p>

              {/* Footer Buttons */}
              <div className="flex justify-between items-center mt-4">
                {/* Like */}
                <button
                  onClick={() => handleLike(recipe._id)}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition"
                >
                  ❤️ {recipe.likes || 0}
                </button>

                {/* Favorite */}
                <button
                  onClick={() => handleFavorite(recipe._id)}
                  className="text-yellow-500 hover:text-yellow-600 text-xl transition"
                >
                  ⭐
                </button>
                <p className="text-gray-600 text-sm">
                  👨‍🍳 By {recipe.user?.name || "Unknown Chef"}
                </p>


                {/* View Button */}
                <button
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                  className="btn btn-sm btn-primary"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
