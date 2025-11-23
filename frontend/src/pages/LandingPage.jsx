// LandingPage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { FaHeart, FaStar, FaUtensils, FaMobileAlt } from "react-icons/fa";

const PALETTE = {
  cream: "#F2E3C6",
  tan: "#E7D2AC",
  brown: "#B57655",
  beige: "#F3D79E",
};

const BG_IMAGE = "/images/doodles-bg.png"; // ← put your background image in public/images/

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="kanit-light min-h-screen overflow-x-hidden"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      {/* ----------------- HERO SECTION ----------------- */}
      <section className="flex flex-col items-center text-center py-28 px-6 backdrop-blur-sm bg-white/30">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold mb-4"
          style={{ color: PALETTE.brown }}
        >
          Cook With Love — Discover Joyful Recipes
        </motion.h1>

        <p className="max-w-2xl text-lg text-gray-700">
          Warm, cozy dishes to try today — explore trending meals, save your
          favourites, and enjoy cooking from the heart.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate("/create")}
            className="px-6 py-3 rounded-lg text-white shadow"
            style={{ background: PALETTE.brown }}
          >
            + Create Recipe
          </button>

          <Link
            to="/signup"
            className="px-6 py-3 rounded-lg border shadow"
            style={{
              borderColor: PALETTE.brown,
              color: PALETTE.brown,
              background: "white",
            }}
          >
            Browse All
          </Link>
        </div>
      </section>

      {/* ----------------- FEATURE CARDS ----------------- */}
      <section className="py-20 px-6 md:px-20 bg-white/60 backdrop-blur-sm">
        <h2
          className="text-4xl font-bold text-center mb-12"
          style={{ color: PALETTE.brown }}
        >
          Why People Love PantryPal
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-6 bg-white/70 rounded-xl shadow-md border" style={{ borderColor: PALETTE.tan }}>
            <FaUtensils className="text-4xl mb-4" style={{ color: PALETTE.brown }} />
            <h3 className="text-xl font-semibold mb-2">Curated Recipes</h3>
            <p className="text-gray-600">
              Explore thousands of uniquely crafted recipes across all cuisines.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white/70 rounded-xl shadow-md border" style={{ borderColor: PALETTE.tan }}>
            <FaHeart className="text-4xl mb-4" style={{ color: PALETTE.brown }} />
            <h3 className="text-xl font-semibold mb-2">Save & Like</h3>
            <p className="text-gray-600">
              Keep your favourite recipes and access them anytime, anywhere.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white/70 rounded-xl shadow-md border" style={{ borderColor: PALETTE.tan }}>
            <FaStar className="text-4xl mb-4" style={{ color: PALETTE.brown }} />
            <h3 className="text-xl font-semibold mb-2">Community Ratings</h3>
            <p className="text-gray-600">
              See trending dishes and top-rated recipes from the community.
            </p>
          </div>
        </div>
      </section>

      

      {/* ----------------- TESTIMONIALS ----------------- */}
      <section className="py-20 px-6 md:px-20 bg-white/70 backdrop-blur-sm">
        <h2
          className="text-4xl font-bold mb-12 text-center"
          style={{ color: PALETTE.brown }}
        >
          What Users Are Saying ❤️
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            "A beautiful app! Makes cooking fun.",
            "Love the UI — feels warm and welcoming!",
            "Amazing collection of recipes!",
          ].map((text, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl shadow-md border"
              style={{ borderColor: PALETTE.tan }}
            >
              <p className="text-gray-700 italic">“{text}”</p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- APP CTA ----------------- */}
      <section className="py-20 px-6 md:px-20 text-center">
        <FaMobileAlt className="text-5xl mx-auto mb-4" style={{ color: PALETTE.brown }} />

        <h2
          className="text-4xl font-bold mb-4"
          style={{ color: PALETTE.brown }}
        >
          Coming Soon: PantryPal Mobile App 📱
        </h2>
        <p className="text-gray-700 max-w-xl mx-auto">
          Cook, save recipes, and shop ingredients — all in one place.
        </p>
      </section>

      
    </div>
  );
};

export default LandingPage;
