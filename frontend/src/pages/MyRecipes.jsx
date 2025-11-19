import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchMyRecipes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/recipes/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("📥 RESPONSE RAW:", data); // ✅ Correct log

      if (!res.ok) {
        toast.error(data.message || "Failed to load your recipes");
        return;
      }

      // FIX: Use correct key: data.recipes
      if (Array.isArray(data.recipes)) {
        setRecipes(data.recipes);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error("❌ Error loading my recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please log in");
      navigate("/login");
      return;
    }
    fetchMyRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Recipe deleted");
        setRecipes((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error(data.message || "Error deleting recipe");
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
      toast.error("Error deleting recipe");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        Loading your recipes...
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900">
        My Recipes 👨‍🍳
      </h1>

      {recipes.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-600 text-lg">
            You haven't created any recipes yet.
          </p>
          <button
            onClick={() => navigate("/create")}
            className="btn btn-primary mt-4"
          >
            ➕ Create Your First Recipe
          </button>
        </div>
      ) : (
        <div
          className="grid gap-6 sm:gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="border rounded-lg shadow-md bg-white hover:shadow-xl transition overflow-hidden"
            >
              <img
                src={
                  recipe.images?.[0]
                    ? `${API_URL}/${recipe.images[0]}`
                    : "/no-image.png"
                }
                onClick={() => navigate(`/recipe/${recipe._id}`)}
                className="w-full h-52 object-cover cursor-pointer"
                alt={recipe.title}
              />

              <div className="p-4">
                <h2
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                  className="text-xl font-semibold text-gray-800 cursor-pointer truncate"
                >
                  {recipe.title}
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Diet: {recipe.dietType || "N/A"}
                </p>

                <p className="text-gray-500 text-sm">
                  Time: {recipe.cookingTime || "-"} mins
                </p>

                <p className="text-gray-500 text-sm">
                  ❤️ Likes: {recipe.likes || 0}
                </p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                    className="btn btn-sm btn-primary"
                  >
                    View
                  </button>

                  <button
                    onClick={() => navigate(`/edit/${recipe._id}`)}
                    className="btn btn-sm btn-outline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(recipe._id)}
                    className="btn btn-sm btn-error text-white"
                  >
                    Delete
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

export default MyRecipes;
