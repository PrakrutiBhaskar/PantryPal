// SearchPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const PALETTE = {
  beige: "#F3D79E",
  brown: "#B57655",
  cream: "#F2E3C6",
  tan: "#E7D2AC",
  nude: "#D0B79A",
  black: "#000000",
};

// Debounce helper
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

  // UI inputs
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 400);

  const [cuisine, setCuisine] = useState("");
  const [dietType, setDietType] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // Data state
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filters
  const cuisines = useMemo(
    () => ["All", "Indian", "Italian", "Chinese", "Mexican", "American", "Fusion"],
    []
  );

  const diets = useMemo(() => ["All", "Vegetarian", "Vegan", "Keto", "Gluten-Free"], []);

  const timeBuckets = useMemo(
    () => [
      { label: "≤ 15m", val: 15 },
      { label: "≤ 30m", val: 30 },
      { label: "≤ 60m", val: 60 },
      { label: "Any", val: "" },
    ],
    []
  );

  // Build query parameters
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (debouncedQuery?.trim()) params.set("search", debouncedQuery.trim());
    if (cuisine && cuisine !== "All") params.set("cuisine", cuisine);
    if (dietType && dietType !== "All") params.set("dietType", dietType);
    if (maxTime) params.set("maxTime", maxTime);
    if (sort) params.set("sort", sort);
    params.set("page", page);
    params.set("limit", limit);
    return params.toString();
  };

  // Fetch results on filter changes
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const queryStr = buildQueryParams();
        const res = await fetch(`${API_URL}/api/recipes?${queryStr}`);
        const data = await res.json();

        if (res.ok) {
          const list = Array.isArray(data) ? data : data.recipes || [];
          setRecipes(list);
          setTotal(data.total || list.length);
        } else {
          toast.error(data.message || "Failed to search recipes");
          setRecipes([]);
          setTotal(0);
        }
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    };

    setPage(1);
    fetchResults();
    // eslint-disable-next-line
  }, [debouncedQuery, cuisine, dietType, maxTime, sort]);

  // Fetch when page changes
  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const queryStr = buildQueryParams();
        const res = await fetch(`${API_URL}/api/recipes?${queryStr}`);
        const data = await res.json();

        if (res.ok) {
          const list = Array.isArray(data) ? data : data.recipes || [];
          setRecipes(list);
          setTotal(data.total || list.length);
        }
      } catch {
        toast.error("Failed to load page");
      } finally {
        setLoading(false);
      }
    };

    if (page > 1) fetchPage();
    // eslint-disable-next-line
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Handlers
  const clearFilters = () => {
    setQuery("");
    setCuisine("");
    setDietType("");
    setMaxTime("");
    setSort("newest");
    setPage(1);
  };

  const handleView = (id) => navigate(`/recipe/${id}`);

  const getImageUrl = (r) =>
    r.images?.[0] ? `${API_URL}/${r.images[0]}` : "/no-image.png";

  return (
    <div
      className="kanit-light min-h-screen"
      style={{ background: PALETTE.cream }}
    >
      {/* HERO */}
      <div
        className="relative h-44 md:h-56 rounded-b-2xl overflow-hidden"
        style={{
          backgroundImage: `url("/search-hero.jpg")`, // <-- put your image inside /public
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.95)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(243,215,158,0.9), rgba(247,238,219,0.4))",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{ color: PALETTE.brown }}
          >
            Discover Recipes — Search, Filter, Enjoy
          </h1>
          <p className="mt-2 text-sm md:text-base text-gray-700">
            Live search across titles, ingredients, cuisines & more.
          </p>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="mx-auto max-w-6xl px-4 -mt-8">
        <div
          className="p-4 rounded-xl shadow-md flex flex-col md:flex-row gap-3 items-center"
          style={{
            background: "rgba(255,255,255,0.85)",
            border: `1px solid ${PALETTE.tan}`,
            backdropFilter: "blur(8px)",
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes, ingredients, cuisines..."
            className="input input-bordered flex-1 w-full"
            style={{ borderColor: PALETTE.tan }}
          />

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
              background: "white",
              color: PALETTE.brown,
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* FILTER CHIPS */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Cuisine */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2">Cuisine:</span>
            {cuisines.map((c) => {
              const active = (c === "All" && cuisine === "") || c === cuisine;
              return (
                <button
                  key={c}
                  onClick={() => setCuisine(c === "All" ? "" : c)}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    background: active ? PALETTE.brown : "white",
                    color: active ? "white" : PALETTE.brown,
                    border: `1px solid ${PALETTE.tan}`,
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Diet */}
          <div className="flex flex-wrap gap-2 ml-3">
            <span className="text-sm text-gray-600 mr-2">Diet:</span>
            {diets.map((d) => {
              const active = (d === "All" && dietType === "") || d === dietType;
              return (
                <button
                  key={d}
                  onClick={() => setDietType(d === "All" ? "" : d)}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    background: active ? PALETTE.brown : "white",
                    color: active ? "white" : PALETTE.brown,
                    border: `1px solid ${PALETTE.tan}`,
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* Time */}
          <div className="flex flex-wrap gap-2 ml-auto">
            <span className="text-sm text-gray-600 mr-2">Time:</span>
            {timeBuckets.map((t) => {
              const active = String(t.val) === String(maxTime);
              return (
                <button
                  key={t.label}
                  onClick={() => setMaxTime(t.val)}
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

      {/* RESULTS GRID */}
      <div className="max-w-6xl mx-auto px-4 mt-6 pb-10">
        {loading ? (
          <div
            className="text-center py-20 text-lg font-semibold"
            style={{ color: PALETTE.brown }}
          >
            Searching...
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20">
            <div
              className="text-xl font-semibold mb-3"
              style={{ color: PALETTE.brown }}
            >
              No recipes found
            </div>
            <p className="text-gray-600 mb-5">
              Try changing filters or search keywords.
            </p>
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
              style={{
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",
              }}
            >
              {recipes.map((r) => (
                <div
                  key={r._id}
                  onClick={() => handleView(r._id)}
                  className="rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: "white",
                    border: `1px solid ${PALETTE.tan}`,
                  }}
                >
                  <img
                    src={getImageUrl(r)}
                    className="w-full h-44 object-cover"
                    alt={r.title}
                  />

                  <div className="p-4">
                    <h3
                      className="text-xl font-semibold mb-1"
                      style={{ color: PALETTE.brown }}
                    >
                      {r.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {typeof r.ingredients === "string"
                        ? r.ingredients.slice(0, 80) +
                          (r.ingredients.length > 80 ? "..." : "")
                        : ""}
                    </p>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-700">
                          ⏱ {r.cookingTime || "-"} mins
                        </p>
                        <p className="text-sm text-gray-700">
                          ❤️ {r.likes || 0}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(r._id);
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

            {/* PAGINATION */}
            <div className="mt-8 flex justify-center items-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 rounded-md"
                style={{
                  border: `1px solid ${PALETTE.tan}`,
                  background: page > 1 ? "white" : "#eee9df",
                  color: PALETTE.brown,
                }}
              >
                Prev
              </button>

              <div
                className="px-4 py-2 rounded-md"
                style={{
                  border: `1px solid ${PALETTE.tan}`,
                  background: "white",
                }}
              >
                Page {page} / {totalPages}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-2 rounded-md"
                style={{
                  border: `1px solid ${PALETTE.tan}`,
                  background: page < totalPages ? "white" : "#eee9df",
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
