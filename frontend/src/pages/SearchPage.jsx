// SearchPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const PALETTE = {
  beige: "#F3D79E",
  brown: "#B57655",
  cream: "#F2E3C6",
  tan: "#E7D2AC",
  nude: "#D0B79A",
  black: "#000000",
};

// helper debounce
function useDebounced(value, delay = 450) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchPage() {
  const navigate = useNavigate();

  // UI state
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 400);

  const [cuisine, setCuisine] = useState("");
  const [dietType, setDietType] = useState("");
  const [maxTime, setMaxTime] = useState(""); // number or "", use buckets like 15, 30, 60
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // results
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // quick chips data (could be fetched from backend if dynamic)
  const cuisines = useMemo(
    () => ["All", "Indian", "Italian", "Chinese", "Mexican", "American", "Fusion"],
    []
  );
  const diets = useMemo(() => ["All", "Vegetarian", "Vegan", "Keto", "Gluten-Free"], []);
  const timeBuckets = useMemo(() => [
    { label: "≤ 15m", val: 15 },
    { label: "≤ 30m", val: 30 },
    { label: "≤ 60m", val: 60 },
    { label: "Any", val: "" },
  ], []);

  // helper to build query string
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (debouncedQuery?.trim()) params.set("search", debouncedQuery.trim());
    if (cuisine && cuisine !== "All") params.set("cuisine", cuisine);
    if (dietType && dietType !== "All") params.set("dietType", dietType);
    if (maxTime) params.set("maxTime", String(maxTime));
    if (sort) params.set("sort", sort);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    return params.toString();
  };

  // Fetch results whenever filters change
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const qs = buildQueryParams();
        const url = `${API_URL}/api/recipes${qs ? `?${qs}` : ""}`;
        const res = await fetch(url);
        const data = await res.json();

        // backend sometimes returns { recipes, total, page, totalPages } or an array
        if (res.ok) {
          if (Array.isArray(data)) {
            setRecipes(data);
            setTotal(data.length);
          } else {
            setRecipes(data.recipes || []);
            setTotal(data.total || (data.recipes ? data.recipes.length : 0));
          }
        } else {
          toast.error(data.message || "Failed to search recipes");
          setRecipes([]);
          setTotal(0);
        }
      } catch (err) {
        console.error("Search error:", err);
        toast.error("Network error while searching");
        setRecipes([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    // whenever search filters change, reset to page 1 (unless explicit)
    setPage(1);
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, cuisine, dietType, maxTime, sort]);

  // fetch for page changes (keeps other filters)
  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const qs = buildQueryParams();
        const url = `${API_URL}/api/recipes${qs ? `?${qs}` : ""}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          if (Array.isArray(data)) {
            setRecipes(data);
            setTotal(data.length);
          } else {
            setRecipes(data.recipes || []);
            setTotal(data.total || (data.recipes ? data.recipes.length : 0));
          }
        } else {
          toast.error(data.message || "Failed to fetch page");
        }
      } catch (err) {
        console.error("Pagination fetch error:", err);
        toast.error("Failed to fetch recipes");
      } finally {
        setLoading(false);
      }
    };

    // only run on page changes (skip initial because it's handled above)
    if (page > 1) fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // derived
  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));

  // handlers
  const toggleCuisine = (c) => setCuisine(c === "All" ? "" : c);
  const toggleDiet = (d) => setDietType(d === "All" ? "" : d);
  const chooseTime = (t) => setMaxTime(t === "" ? "" : t);

  const clearFilters = () => {
    setQuery("");
    setCuisine("");
    setDietType("");
    setMaxTime("");
    setSort("newest");
    setPage(1);
  };

  const handleViewRecipe = (id) => navigate(`/recipe/${id}`);

  // Small helper for card image path
  const getImageUrl = (r) => {
    if (r.images?.length) return `${API_URL}/${r.images[0]}`;
    return "/no-image.png";
  };

  return (
    <div className="kanit-light min-h-screen" style={{ background: PALETTE.cream }}>
      {/* Hero header: uses uploaded palette image */}
      <div
        className="relative h-44 md:h-56 rounded-b-2xl overflow-hidden"
        style={{
          backgroundImage: `url("/mnt/data/3280de49-5dfd-4004-aee1-cfcc39a75843.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.95)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(243,215,158,0.9), rgba(247,238,219,0.4))",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: PALETTE.brown }}>
            Discover Recipes — Search, Filter, Enjoy
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-700">
            Live search across titles, ingredients and steps. Try "pasta", "paneer", or "30 mins".
          </p>
        </div>
      </div>

      {/* Floating search bar */}
      <div className="mx-auto max-w-6xl px-4 -mt-8">
        <div
          className="glass p-4 rounded-xl shadow-md flex flex-col md:flex-row gap-3 items-center"
          style={{
            background: "rgba(255,255,255,0.85)",
            border: `1px solid ${PALETTE.tan}`,
          }}
        >
          <div className="flex-1 w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes, ingredients, cuisines..."
              className="input input-bordered w-full"
              style={{ borderColor: PALETTE.tan }}
            />
          </div>

          <div className="flex gap-2 items-center">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select select-bordered"
              style={{ borderColor: PALETTE.tan }}
            >
              <option value="newest">Newest</option>
              <option value="likes">Most liked</option>
              <option value="time">Shortest time</option>
            </select>

            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl"
              style={{
                border: `1px solid ${PALETTE.tan}`,
                background: "transparent",
                color: PALETTE.brown,
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Filters chips */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Cuisine chips */}
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-sm text-gray-600 mr-2">Cuisine:</span>
            {cuisines.map((c) => {
              const active = (c === "All" ? cuisine === "" : cuisine === c);
              return (
                <button
                  key={c}
                  onClick={() => toggleCuisine(c)}
                  className={`px-3 py-1 rounded-full text-sm transition-shadow`}
                  style={{
                    background: active ? PALETTE.brown : "white",
                    color: active ? "white" : PALETTE.brown,
                    border: `1px solid ${PALETTE.tan}`,
                    boxShadow: active ? "0 4px 12px rgba(181,118,85,0.15)" : "none",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Diet chips */}
          <div className="flex gap-2 items-center ml-3 flex-wrap">
            <span className="text-sm text-gray-600 mr-2">Diet:</span>
            {diets.map((d) => {
              const active = (d === "All" ? dietType === "" : dietType === d);
              return (
                <button
                  key={d}
                  onClick={() => toggleDiet(d)}
                  className="px-3 py-1 rounded-full text-sm transition-shadow"
                  style={{
                    background: active ? PALETTE.brown : "white",
                    color: active ? "white" : PALETTE.brown,
                    border: `1px solid ${PALETTE.tan}`,
                    boxShadow: active ? "0 4px 12px rgba(181,118,85,0.15)" : "none",
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* Time chips */}
          <div className="flex gap-2 items-center ml-auto">
            <span className="text-sm text-gray-600 mr-2">Time:</span>
            {timeBuckets.map((t) => {
              const active = (String(t.val) === String(maxTime));
              return (
                <button
                  key={t.label}
                  onClick={() => chooseTime(t.val)}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    background: active ? PALETTE.brown : "white",
                    color: active ? "white" : PALETTE.brown,
                    border: `1px solid ${PALETTE.tan}`,
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div className="max-w-6xl mx-auto px-4 mt-6 pb-10">
        {loading ? (
          <div className="text-center py-20 text-lg font-semibold" style={{ color: PALETTE.brown }}>
            Searching...
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-xl font-semibold mb-3" style={{ color: PALETTE.brown }}>
              No recipes found
            </div>
            <p className="text-gray-600 mb-5">Try searching for something else or clear filters.</p>
            <button
              onClick={clearFilters}
              className="px-5 py-2 rounded-xl"
              style={{
                background: PALETTE.brown,
                color: "white",
                border: `1px solid ${PALETTE.tan}`,
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div
              className="grid gap-6 sm:gap-8"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
            >
              {recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
                  style={{ background: "white", border: `1px solid ${PALETTE.tan}` }}
                  onClick={() => handleViewRecipe(recipe._id)}
                >
                  <img
                    src={getImageUrl(recipe)}
                    alt={recipe.title}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-1" style={{ color: PALETTE.brown }}>
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {recipe.ingredients ? (typeof recipe.ingredients === "string" ? recipe.ingredients.slice(0, 80) + (recipe.ingredients.length > 80 ? "..." : "") : "") : ""}
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-gray-700">⏱ {recipe.cookingTime || "-" } mins</p>
                        <p className="text-sm text-gray-700">❤️ {recipe.likes || 0}</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/recipe/${recipe._id}`);
                        }}
                        className="px-3 py-2 rounded-lg"
                        style={{
                          background: PALETTE.brown,
                          color: "white",
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center items-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-2 rounded-md"
                style={{
                  border: `1px solid ${PALETTE.tan}`,
                  background: page > 1 ? "white" : "#f3f0ea",
                  color: PALETTE.brown,
                }}
              >
                Prev
              </button>

              <div className="px-4 py-2 rounded-md" style={{ border: `1px solid ${PALETTE.tan}`, background: "white" }}>
                Page {page} / {totalPages}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-2 rounded-md"
                style={{
                  border: `1px solid ${PALETTE.tan}`,
                  background: page < totalPages ? "white" : "#f3f0ea",
                  color: PALETTE.brown,
                }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
