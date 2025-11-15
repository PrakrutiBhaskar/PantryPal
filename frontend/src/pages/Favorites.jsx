import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const Favorites = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API_URL}/api/recipes/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401) {
        navigate("/signup");
        return;
      }

      const data = await res.json();
      setRecipes(data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching favorites:", err);
      toast.error("Failed to load favorites");
    }
  };

  useEffect(() => {
    if (!token) {
      return navigate("/signup");
    }
    fetchFavorites();
  }, []);

  const handleUnfavorite = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}/favorite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Removed from favorites");
        setRecipes((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error removing favorite");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading favorites...</div>;
  }

  return (
    <div className="px-5 md:px-16 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
        ⭐ Your Favorite Recipes
      </h1>

      {recipes.length === 0 ? (
        <p className="text-center text-gray-600">No favorites yet.</p>
      ) : (
        <div
          className="grid gap-6 sm:gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="border rounded-lg shadow-md bg-white hover:shadow-xl transition cursor-pointer overflow-hidden"
            >
              <img
                src={
                  recipe.images && recipe.images.length > 0
                    ? `${API_URL}/${recipe.images[0]}`
                    : "https://via.placeholder.com/400x300?text=No+Image"
                }
                alt={recipe.title}
                className="w-full h-52 object-cover"
                onClick={() => navigate(`/recipe/${recipe._id}`)}
              />

              <div className="p-4">
                <h3
                  className="text-xl font-semibold text-gray-800 truncate"
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                >
                  {recipe.title}
                </h3>

                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {recipe.ingredients?.slice(0, 80)}...
                </p>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleUnfavorite(recipe._id)}
                    className="text-red-500 hover:text-red-600 text-xl"
                  >
                    ❌ Remove
                  </button>

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
      )}
    </div>
  );
};

export default Favorites;
