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
      className="mt-20 py-10 px-6 backdrop-blur-md bg-white/60 border-t"
      style={{ borderColor: PALETTE.tan }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 text-center md:text-left">
        
        {/* Brand */}
        <div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: PALETTE.brown }}
          >
            PantryPal
          </h2>
          <p className="text-gray-700 text-sm">
            Delicious recipes. Warm design.  
            Cook with love every day. ❤️
          </p>
        </div>

        {/* Quick Links */}
        <div>
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
        <div>
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

        
      </div>

      {/* Bottom strip */}
      <div className="text-center mt-10 text-sm text-gray-700">
        © {new Date().getFullYear()} PantryPal — Crafted with ❤️ & good food.
      </div>
    </footer>
  );
};

export default Footer;
