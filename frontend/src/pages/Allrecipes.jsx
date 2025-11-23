import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const PALETTE = {
  cream: "#F2E3C6",
  tan: "#E7D2AC",
  brown: "#B57655",
};

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  // Fetch all recipes
  const fetchRecipes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/recipes`);
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div
      className="kanit-light min-h-screen px-5 md:px-16 py-12"
      style={{ background: PALETTE.cream }}
    >
      <h1
        className="text-4xl font-bold text-center mb-12"
        style={{ color: PALETTE.brown }}
      >
        All Recipes 🍽️
      </h1>

      {recipes.length === 0 ? (
        <p className="text-center text-gray-700 text-lg">No recipes found.</p>
      ) : (
        <div
          className="grid gap-6 sm:gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="rounded-xl shadow-md bg-white hover:shadow-xl transition overflow-hidden cursor-pointer"
              style={{ border: `1px solid ${PALETTE.tan}` }}
              onClick={() => navigate(`/recipe/${recipe._id}`)}
            >
              <img
                src={
                  recipe.images?.length
                    ? `${API_URL}/${recipe.images[0]}`
                    : "https://via.placeholder.com/400x300?text=No+Image"
                }
                className="w-full h-56 object-cover"
                alt={recipe.title}
              />

              <div className="p-4">
                <h3
                  className="text-xl font-semibold truncate"
                  style={{ color: PALETTE.brown }}
                >
                  {recipe.title}
                </h3>

                <p className="text-gray-600 text-sm mt-1">
                  {recipe.cuisine || "Cuisine"}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-700">
                    ⏱ {recipe.cookingTime || "--"} mins
                  </span>
                  <span className="text-red-500 text-lg">
                    ❤️ {recipe.likes || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllRecipes;
