import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/background.jpg"; // optional background image

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-16 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
          Discover. Create. Share Delicious Recipes 🍳
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-2xl">
          Explore thousands of community-made recipes or share your own food creations with the world.
        </p>

        <div className="mt-8 flex gap-4">
          <Link to="/signup" className="btn btn-primary text-lg px-6 py-2">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-secondary text-lg px-6 py-2">
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6 md:px-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Why You’ll Love PantryPal
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">👩‍🍳 Create Recipes</h3>
            <p className="text-gray-600">
              Share your favorite dishes with step-by-step instructions and images.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">🍲 Explore Dishes</h3>
            <p className="text-gray-600">
              Browse a wide range of cuisines shared by other passionate cooks.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">❤️ Save Favorites</h3>
            <p className="text-gray-600">
              Bookmark your favorite recipes and access them anytime, anywhere.
            </p>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default LandingPage;
