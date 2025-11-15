import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const LikedPage = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Remove liked
  const handleUnliked = async (id, e) => {
    e.stopPropagation(); // Prevent navigation when clicking ❌

    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Removed from liked");
        setRecipes((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error removing liked");
    }
  };

  useEffect(() => {
    if (!token) return navigate("/signup");

    const fetchLiked = async () => {
      try {
        const res = await fetch(`${API_URL}/api/recipes/liked`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
    <div className="px-5 md:px-16 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        ❤️ Liked Recipes
      </h1>

      {recipes.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">
          You haven’t liked any recipes yet.
        </p>
      ) : (
        <div
          className="grid gap-6 sm:gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="border rounded-lg shadow-md bg-white hover:shadow-xl transition overflow-hidden cursor-pointer"
              onClick={() => navigate(`/recipe/${recipe._id}`)}
            >
              <img
                src={
                  recipe.images?.length
                    ? `${API_URL}/${recipe.images[0]}`
                    : "/placeholder.png"
                }
                className="w-full h-48 object-cover"
                alt={recipe.title}
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold">{recipe.title}</h3>

                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {recipe.ingredients}
                </p>

                <p className="mt-3 text-sm text-gray-700">
                  👍 {recipe.likes} likes
                </p>

                <button
                  onClick={(e) => handleUnliked(recipe._id, e)}
                  className="mt-3 text-red-500 hover:text-red-600 text-xl"
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
