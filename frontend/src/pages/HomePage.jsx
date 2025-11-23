import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaSun,
  FaMoon,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";

/**
 * HomePage.jsx
 * Final complete homepage with:
 * - Centered glass search bar inside hero
 * - Parallax hero
 * - Trending carousel
 * - Reveal animations
 * - Shimmer skeletons
 * - Light / Dark bakery theme toggle
 *
 * Requirements:
 * - Add kanit font and .kanit-light class in your global CSS (index.html or index.css)
 * - Put hero-food.jpg and no-image.png into /public (or change paths)
 * - Ensure backend API_URL is defined in env or default will be http://localhost:5001
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const PALETTE = {
  beige: "#F3D79E",
  brown: "#B57655",
  cream: "#F7EEDB",
  tan: "#E7D2AC",
  nude: "#D0B79A",
  caramel: "#BA8C73",
  black: "#000000",
};

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [parallaxY, setParallaxY] = useState(0);

  const navigate = useNavigate();
  const carouselRef = useRef(null);

  useEffect(() => {
    applyTheme(theme);
    fetchRecipes();

    const onScroll = () => setParallaxY(window.scrollY * 0.12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchRecipes() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/recipes`);
      const data = await res.json();
      const list = data.recipes || data || [];
      setRecipes(list);
      setTrending(
        [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 8)
      );
    } catch (err) {
      console.error("Failed to load recipes", err);
      toast.error("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  }

  function applyTheme(t) {
    const root = document.documentElement;
    if (t === "dark") {
      root.style.setProperty("--bg", "#111111");
      root.style.setProperty("--card", "#0f0f0f");
      root.style.setProperty("--text", "#f6f6f6");
      document.documentElement.classList.add("dark");
    } else {
      root.style.setProperty("--bg", PALETTE.cream);
      root.style.setProperty("--card", "#ffffff");
      root.style.setProperty("--text", PALETTE.black);
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", t);
    setTheme(t);
  }

  function toggleTheme() {
    applyTheme(theme === "light" ? "dark" : "light");
  }

  function scrollCarousel(dir = 1) {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector(".tr-card");
    const scrollAmount = (card?.offsetWidth || 300) + 16;
    el.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
  }

  function onSearch(e) {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  // Skeleton (shimmer)
  const Skeleton = ({ h = 44 }) => (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)" }}>
      <div
        className="skeleton-image"
        style={{ width: "100%", height: `${h}px` }}
      />
      <div className="p-4 space-y-3">
        <div className="skeleton-line w-3/4 h-5" />
        <div className="skeleton-line w-full h-4" />
        <div className="skeleton-line w-1/2 h-4" />
      </div>
    </div>
  );

  return (
    <div className="kanit-light" style={{ background: "var(--bg)" }}>
      {/* Inline small CSS (shimmer, glass) */}
      <style>{`
        .glass {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(12px);
        }
        .dark .glass {
          background: rgba(20,20,20,0.45);
        }
        .skeleton-image, .skeleton-line {
          background: linear-gradient(90deg, #e6e6e6 25%, #f3f3f3 50%, #e6e6e6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.2s linear infinite;
          border-radius: 6px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ensure hero children are visible and not clipped */
        .hero-wrap { overflow: visible; }

        /* small niceties */
        .tr-scroll { -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
      `}</style>

      {/* HERO */}
      <section
        className="hero-wrap relative flex flex-col items-center text-center px-6 md:px-12 py-20 md:py-28"
        style={{ minHeight: "56vh" }}
      >
        {/* Parallax background image (replace /hero-food.jpg as needed) */}
        <div
          className="absolute inset-0 parallax-bg"
          style={{
            backgroundImage: `url('/hero-food.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${parallaxY}px)`,
            zIndex: -2,
            filter: theme === "dark" ? "brightness(.6) contrast(.9)" : "none",
          }}
        />

        {/* overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(247,238,219,0.65), rgba(243,215,158,0.2))",
            zIndex: -1,
          }}
        />

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={{ color: PALETTE.brown }}
          >
            Cook with Love — Discover Joyful Recipes
          </h1>
          <p
            className="max-w-2xl mx-auto text-lg opacity-80 mb-8"
            style={{ color: "var(--text)" }}
          >
            Warm, cozy dishes to try today — explore trending meals, save your favourites, and cook from the heart.
          </p>

          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => navigate("/create")}
              className="px-6 py-3 rounded-xl shadow-md"
              style={{ background: PALETTE.brown, color: "#fff" }}
            >
              Create Recipe
            </button>

            <button
              onClick={() => navigate("/search")}
              className="px-6 py-3 rounded-xl border"
              style={{ borderColor: PALETTE.tan, color: PALETTE.brown, background: "transparent" }}
            >
              Browse All
            </button>
          </div>
        </motion.div>

        {/* CENTERED GLASS SEARCH BAR (guaranteed visible) */}
        <motion.form
          onSubmit={onSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full max-w-2xl z-[9999]"
        >
          <div
            className="glass flex items-center px-5 py-4 rounded-2xl shadow-2xl mx-auto"
            style={{ border: `1px solid ${PALETTE.tan}` }}
          >
            <FaSearch className="text-xl" style={{ color: PALETTE.brown }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes, ingredients, cuisines..."
              className="w-full outline-none text-lg bg-transparent ml-3"
              style={{ color: "var(--text)" }}
            />

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg ml-3"
              style={{ border: `1px solid ${PALETTE.tan}` }}
            >
              {theme === "light" ? (
                <FaMoon style={{ color: PALETTE.brown }} />
              ) : (
                <FaSun style={{ color: "#ffd86b" }} />
              )}
            </button>

            <button
              type="submit"
              className="ml-3 px-4 py-2 rounded-lg"
              style={{ background: PALETTE.brown, color: "#fff" }}
            >
              Search
            </button>
          </div>
        </motion.form>
      </section>

      {/* small spacer so next content does not collide */}
      <div style={{ height: 90 }} />

      {/* TRENDING CAROUSEL */}
      <section className="px-6 md:px-12 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center text-2xl font-bold" style={{ color: PALETTE.brown }}>
            Trending Recipes
          </h2>

          <div className="flex gap-2">
            <button onClick={() => scrollCarousel(-1)} className="p-2 rounded-full" aria-label="prev">
              <FaChevronLeft />
            </button>
            <button onClick={() => scrollCarousel(1)} className="p-2 rounded-full" aria-label="next">
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="tr-scroll flex gap-6 overflow-x-auto pb-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[260px] tr-card">
                  <Skeleton h={176} />
                </div>
              ))
            : trending.length === 0
            ? <p>No trending recipes yet.</p>
            : trending.map((r) => (
                <div
                  key={r._id}
                  className="min-w-[260px] max-w-[320px] tr-card rounded-2xl overflow-hidden"
                  style={{ background: "var(--card)", border: `1px solid ${PALETTE.tan}` }}
                >
                  <img
                    src={r.images?.[0] ? `${API_URL}/${r.images[0]}` : "/no-image.png"}
                    alt={r.title}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 truncate" style={{ color: PALETTE.brown }}>
                      {r.title}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span style={{ color: PALETTE.caramel }}>❤️ {r.likes || 0}</span>
                      <button
                        onClick={() => navigate(`/recipe/${r._id}`)}
                        className="px-3 py-1 rounded-lg"
                        style={{ background: PALETTE.brown, color: "#fff" }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* MAIN GRID — EXPLORE RECIPES */}
      <section className="px-6 md:px-16 py-12">
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: PALETTE.brown }}>
          Explore Recipes
        </h2>

        <div
          className="grid gap-8"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
            : recipes.slice(0, 10).map((recipe) => (
                <motion.div
                  key={recipe._id}
                  className="rounded-2xl overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    background: "var(--card)",
                    border: `1px solid ${PALETTE.tan}`,
                  }}
                >
                  <img
                    src={
                      recipe.images?.[0]
                        ? `${API_URL}/${recipe.images[0]}`
                        : "/no-image.png"
                    }
                    alt={recipe.title}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4">
                    <h3
                      className="text-xl font-semibold mb-2 truncate"
                      style={{ color: PALETTE.brown }}
                    >
                      {recipe.title}
                    </h3>

                    <p className="text-sm opacity-80 mb-4">
                      {Array.isArray(recipe.ingredients)
                        ? recipe.ingredients.slice(0, 4).join(", ")
                        : recipe.ingredients || "No ingredients listed"}
                    </p>

                    <div className="flex justify-between items-center">
                      <span style={{ color: PALETTE.caramel }}>
                        ❤️ {recipe.likes || 0}
                      </span>

                      <button
                        onClick={() => navigate(`/recipe/${recipe._id}`)}
                        className="px-4 py-2 rounded-lg"
                        style={{ background: PALETTE.brown, color: "#fff" }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>

        {/* VIEW ALL BUTTON */}
        {!loading && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate("/recipes")}
              className="px-8 py-3 rounded-xl shadow-md text-lg font-semibold"
              style={{
                background: PALETTE.brown,
                color: "#fff",
                borderColor: PALETTE.tan,
              }}
            >
              View All Recipes →
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
