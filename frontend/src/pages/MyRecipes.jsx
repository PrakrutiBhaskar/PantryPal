import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchMyRecipes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/recipes/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Handle 401 session expiry
      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await safeJson(res); // ✅ Safe parse

      if (!res.ok) {
        toast.error(data.message || "Failed to load your recipes");
        return;
      }

      setRecipes(Array.isArray(data) ? data : data.recipes || []);
    } catch (error) {
      console.error("Error loading my recipes:", error);
      toast.error("Error loading your recipes");
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id) => {
    const yes = window.confirm("Are you sure you want to delete this recipe?");
    if (!yes) return;

    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await safeJson(res); // ✅ Safe parse

      if (res.ok) {
        toast.success("Recipe deleted");
        setRecipes((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error(data.message || "Error deleting recipe");
      }
    } catch (err) {
      console.error("Error deleting recipe:", err);
      toast.error("Error deleting recipe");
    }
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen text-lg font-semibold kanit-light"
        style={{ color: PALETTE.brown }}
      >
        Loading your recipes...
      </div>
    );
  }

  return (
    <div
      className="kanit-light px-6 md:px-16 py-10"
      style={{ background: PALETTE.cream }}
    >
      <h1
        className="text-4xl font-bold text-center mb-10"
        style={{ color: PALETTE.brown }}
      >
        My Recipes 👨‍🍳
      </h1>

      {recipes.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-lg mb-4" style={{ color: PALETTE.caramel }}>
            You haven't created any recipes yet.
          </p>
          <button
            onClick={() => navigate("/create")}
            className="px-6 py-3 rounded-xl shadow"
            style={{
              background: PALETTE.brown,
              color: "white",
              border: `1px solid ${PALETTE.tan}`,
            }}
          >
            ➕ Create Your First Recipe
          </button>
        </div>
      ) : (
        <div
          className="grid gap-8 sm:gap-10"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
              style={{ background: "white", border: `1px solid ${PALETTE.tan}` }}
            >
              <img
                src={
                  recipe.images?.[0]
                    ? `${API_URL}/${recipe.images[0].replace(/\\/g, "/")}`
                    : "/no-image.png"
                }
                onClick={() => navigate(`/recipe/${recipe._id}`)}
                className="w-full h-48 object-cover"
                alt={recipe.title}
              />

              <div className="p-5">
                <h2
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                  className="text-xl font-semibold truncate mb-2 cursor-pointer"
                  style={{ color: PALETTE.brown }}
                >
                  {recipe.title}
                </h2>

                <p className="text-sm opacity-80 mb-1">
                  Diet: {recipe.dietType || "N/A"}
                </p>
                <p className="text-sm opacity-80 mb-1">
                  Time: {recipe.cookingTime || "-"} mins
                </p>
                <p className="text-sm opacity-80 mb-3">
                  ❤️ Likes: {recipe.likes || 0}
                </p>

                <div className="flex justify-between gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                    className="flex-1 py-2 rounded-xl text-white"
                    style={{ background: PALETTE.brown }}
                  >
                    View
                  </button>

                  <button
                    onClick={() => navigate(`/edit/${recipe._id}`)}
                    className="flex-1 py-2 rounded-xl"
                    style={{
                      border: `1px solid ${PALETTE.tan}`,
                      color: PALETTE.brown,
                      background: "transparent",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(recipe._id)}
                    className="flex-1 py-2 rounded-xl text-white"
                    style={{ background: "#C62828" }}
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
