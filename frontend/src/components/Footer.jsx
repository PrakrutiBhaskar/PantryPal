import React from "react";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-20 border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-3">PantryPal</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your smart kitchen companion — discover, create, and manage recipes effortlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer transition"><Link to="/home">Home</Link></li>
            <li className="hover:text-white cursor-pointer transition"><Link to="/create">Create Recipes</Link></li>
            <li className="hover:text-white cursor-pointer transition"><Link to="/myrecipes">My Recipes</Link></li>
            <li className="hover:text-white cursor-pointer transition"><Link to="/favorites">Favorites</Link></li>
            <li className="hover:text-white cursor-pointer transition"><Link to="/liked">Liked</Link></li>
            <li className="hover:text-white cursor-pointer transition"><Link to="/profile">Profile</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Connect With Us</h3>
          <div className="flex space-x-5 text-xl">
            <a href="#" className="hover:text-white transition"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition"><FaGithub /></a>
            <a href="#" className="hover:text-white transition"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-5">
        © {new Date().getFullYear()} PantryPal — All Rights Reserved.
      </div>
    </footer>
  );
}