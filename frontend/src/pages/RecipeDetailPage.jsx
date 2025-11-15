import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch recipe by ID
  const fetchRecipe = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/recipes/${id}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error loading recipe");
        return;
      }

      setRecipe(data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching recipe:", err);
      toast.error("Failed to load recipe");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  // Like recipe
  const handleLike = async () => {
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`http://localhost:5001/api/recipes/${id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchRecipe(); // refresh likes
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error liking recipe");
    }
  };

  // Favorite recipe
  const handleFavorite = async () => {
    if (!token) return navigate("/login");

    try {
      const res = await fetch(
        `http://localhost:5001/api/recipes/${id}/favorite`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error favoriting recipe");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Loading recipe...
      </div>
    );
  }

  if (!recipe) return <p className="text-center mt-10">Recipe not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Back Button */}
      <button
        className="btn mb-5"
        onClick={() => navigate("/home")}
      >
        ← Back to Home
      </button>

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {recipe.title}
      </h1>

      {/* Image Carousel */}
      <div className="carousel w-full rounded-xl shadow-lg mb-8">
        {(recipe.images && recipe.images.length > 0 ? recipe.images : ["/placeholder.jpg"])
          .map((img, index) => (
            <div
              id={`slide${index}`}
              key={index}
              className="carousel-item relative w-full"
            >
              <img
                src={
                  img.startsWith("http")
                    ? img
                    : `http://localhost:5001/${img}`
                }
                className="w-full object-cover max-h-[500px]"
                alt="Recipe"
              />

              {/* Navigation Arrows */}
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a
                  href={`#slide${
                    index === 0 ? recipe.images.length - 1 : index - 1
                  }`}
                  className="btn btn-circle"
                >
                  ❮
                </a>
                <a
                  href={`#slide${
                    index === recipe.images.length - 1 ? 0 : index + 1
                  }`}
                  className="btn btn-circle"
                >
                  ❯
                </a>
              </div>
            </div>
          ))}
      </div>

      {/* Like + Favorite */}
      <div className="flex items-center gap-5 mb-8 text-xl">
        <button
          className="flex items-center gap-2 text-red-500 hover:text-red-600"
          onClick={handleLike}
        >
          ❤️ {recipe.likes}
        </button>

        <button
          className="text-yellow-500 hover:text-yellow-600"
          onClick={handleFavorite}
        >
          ⭐ Favorite
        </button>

        <p className="text-black text-md mt-2">
          Created by <strong>{recipe.user?.name || "Anonymous"}</strong>
        </p>

      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ingredients */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">Ingredients 🧂</h2>
          <p className="text-gray-700 whitespace-pre-line">{recipe.ingredients}</p>
        </div>

        {/* Steps */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3">Steps 👨‍🍳</h2>
          <p className="text-gray-700 whitespace-pre-line">{recipe.steps}</p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white p-6 rounded-xl shadow-md mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recipe Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <p>
            <strong>Cuisine:</strong> {recipe.cuisine || "Not specified"}
          </p>
          <p>
            <strong>Diet Type:</strong> {recipe.dietType || "Not specified"}
          </p>
          <p>
            <strong>Cooking Time:</strong> {recipe.cookingTime} mins
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
