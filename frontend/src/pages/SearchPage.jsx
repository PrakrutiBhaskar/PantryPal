import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const SearchPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    cuisine: "",
    dietType: "",
    maxTime: "",
    ingredients: "",
    sort: "newest",
  });
  const [recipes, setRecipes] = useState([]);
  const [diets, setDiets] = useState([]); // 🥗 dynamic diet list
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // reset page when filters change
  };

  // 🥗 Fetch diets dynamically from backend
  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const res = await fetch(`${API_URL}/api/recipes/diets`);
        const data = await res.json();
        setDiets(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error fetching diets:", error);
      }
    };
    fetchDiets();
  }, []);

  // 🔍 Fetch recipes from backend
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        ...filters,
        page,
        limit: 10,
      }).toString();

      const res = await fetch(`${API_URL}/api/recipes?${query}`);
      const data = await res.json();

      setRecipes(data.recipes || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("❌ Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // ⏳ Debounce search/filter requests (auto-fetch)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchRecipes();
    }, 500); // 0.5s debounce
    return () => clearTimeout(delay);
  }, [filters, page]);

  // 🔄 Handle manual search submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  // 🔁 Reset filters + refetch
  const handleReset = () => {
    setFilters({
      search: "",
      cuisine: "",
      dietType: "",
      maxTime: "",
      ingredients: "",
      sort: "newest",
    });
    setPage(1);
    fetchRecipes();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🔍 Advanced Recipe Search
      </h2>

      {/* 🧭 Filter Form */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-lg shadow-md mb-8"
      >
        {/* 🔍 Keyword Search */}
        <input
          type="text"
          name="search"
          placeholder="Search keyword..."
          value={filters.search}
          onChange={handleChange}
          className="input input-bordered w-full"
        />

        {/* 🌍 Cuisine */}
        <input
          type="text"
          name="cuisine"
          placeholder="Cuisine (e.g., Italian, Indian)"
          value={filters.cuisine}
          onChange={handleChange}
          className="input input-bordered w-full"
        />

        {/* 🥗 Dynamic Diet Dropdown */}
        <select
          name="dietType"
          value={filters.dietType}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          <option value="">All Diets</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
          <option value="Keto">Keto</option>
          <option value="Gluten-Free">Gluten-Free</option>
        </select>



        {/* ⏱️ Max Time */}
        <input
          type="number"
          name="maxTime"
          placeholder="Max Time (mins)"
          value={filters.maxTime}
          onChange={handleChange}
          className="input input-bordered w-full"
        />

        {/* 🧂 Ingredients Filter */}
        <input
          type="text"
          name="ingredients"
          placeholder="Ingredients (comma-separated)"
          value={filters.ingredients}
          onChange={handleChange}
          className="input input-bordered w-full md:col-span-2"
        />

        {/* ⚙️ Sort Dropdown */}
        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="likes">Most Liked</option>
          <option value="time">Shortest Time</option>
        </select>

        {/* 🧭 Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 md:col-span-2 lg:col-span-4">
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={loading}
          >
            {loading ? "Searching..." : "Apply Filters"}
          </button>
          <button
            type="button"
            className="btn btn-outline flex-1"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </form>

      {/* 📦 Results */}
      {loading ? (
        <p className="text-center text-gray-500">Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No recipes found matching your filters.</p>
          <button
            className="btn btn-sm btn-outline mt-3"
            onClick={fetchRecipes}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div
            className="grid gap-6 sm:gap-8"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            }}
          >
            {recipes.map((recipe) => (
              <motion.div
                key={recipe._id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="border rounded-lg shadow-md bg-white hover:shadow-xl transition cursor-pointer overflow-hidden"
                onClick={() => navigate(`/recipe/${recipe._id}`)}
              >
                <img
                  src={
                    recipe.image ||
                    "https://images.unsplash.com/photo-1601050690597-6cc5b81c41f0?auto=format&fit=crop&w=400&q=80"
                  }
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {recipe.description}
                  </p>
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <span>👨‍🍳 {recipe.user?.name || "Anonymous"}</span>
                    <span>❤️ {recipe.likes || 0}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 📄 Pagination */}
          <div className="flex justify-center mt-8 gap-4">
            <button
              className="btn btn-outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ⬅️ Previous
            </button>
            <span className="text-gray-600 font-medium mt-2">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
