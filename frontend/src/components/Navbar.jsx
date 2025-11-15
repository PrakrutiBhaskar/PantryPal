import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateLoginStatus = () => setIsLoggedIn(!!localStorage.getItem("token"));
    updateLoginStatus(); // check once at mount
    window.addEventListener("storage", updateLoginStatus);
    return () => window.removeEventListener("storage", updateLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-6">
      {/* Left side - Dropdown + Logo */}
      <div className="navbar-start flex items-center">
        <div className="dropdown">
          <button tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/create">Create Recipes</Link></li>
            <li><Link to="/myrecipes">My Recipes</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
            <li><Link to="/liked">Liked</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>

        <Link
            to="/home"
            className="btn btn-ghost normal-case text-2xl font-bold kanit-light"
        >
        PantryPal
        </Link>


      </div>

      {/* Center (optional, empty for now) */}
      <div className="navbar-center"></div>

      {/* Right side - Auth button */}
      <div className="navbar-end">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
