// Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

const PALETTE = {
  cream: "#F2E3C6",
  tan: "#E7D2AC",
  brown: "#B57655",
  beige: "#F3D79E",
};

const Footer = () => {
  return (
    <footer
      className="mt-20 py-12 px-6 backdrop-blur-md bg-white/60 border-t"
      style={{ borderColor: PALETTE.tan }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="text-center md:text-left">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: PALETTE.brown }}
          >
            PantryPal
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Delicious recipes. Warm design.  
            Cook with love every day. ❤️
          </p>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-start gap-4 mt-4 text-xl">
            <a href="#" className="hover:scale-110 transition-transform" style={{ color: PALETTE.brown }}>
              <FaInstagram />
            </a>
            <a href="#" className="hover:scale-110 transition-transform" style={{ color: PALETTE.brown }}>
              <FaFacebookF />
            </a>
            <a href="#" className="hover:scale-110 transition-transform" style={{ color: PALETTE.brown }}>
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-lg mb-3" style={{ color: PALETTE.brown }}>
            Quick Links
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li><Link to="/home" className="hover:underline">Home</Link></li>
            <li><Link to="/recipes" className="hover:underline">Browse Recipes</Link></li>
            <li><Link to="/create" className="hover:underline">Create Recipe</Link></li>
            <li><Link to="/profile" className="hover:underline">My Profile</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-lg mb-3" style={{ color: PALETTE.brown }}>
            Resources
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li><Link to="/favorites" className="hover:underline">Favorites</Link></li>
            <li><Link to="/liked" className="hover:underline">Liked Recipes</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-lg mb-3" style={{ color: PALETTE.brown }}>
            Stay Updated
          </h3>
          <p className="text-gray-700 text-sm mb-4">
            Subscribe for tasty new recipes delivered weekly.
          </p>
          <div className="flex gap-2 justify-center md:justify-start">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 rounded-lg border w-full"
              style={{
                borderColor: PALETTE.tan,
                background: "white",
              }}
            />
            <button
              className="px-4 py-2 rounded-lg text-white"
              style={{ background: PALETTE.brown }}
            >
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="text-center mt-10 text-sm text-gray-700">
        © {new Date().getFullYear()} <strong>PantryPal</strong> — Crafted with ❤️ & great food.
      </div>
    </footer>
  );
};

export default Footer;
