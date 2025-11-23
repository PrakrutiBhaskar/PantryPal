import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

const colors = {
  beige: "#F3D79E",
  brown: "#B57655",
  cream: "#F7EEDB",
  tan: "#E7D2AC",
  nude: "#D0B79A",
  caramel: "#BA8C73",
};

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateLoginStatus = () =>
      setIsLoggedIn(!!localStorage.getItem("token"));
    updateLoginStatus();
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
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 w-full z-50 shadow-sm kanit-light"
      style={{
        background: `linear-gradient(120deg, ${colors.cream}, ${colors.tan})`,
      }}
    >
      <div className="px-6 md:px-12 h-16 flex items-center justify-between">

        {/* LEFT — Logo */}
        <Link
          to="/home"
          className="text-3xl font-bold tracking-tight kanit-light"
          style={{ color: "black" }}
        >
          PantryPal
        </Link>

        {/* CENTER — Navigation (Desktop) */}
        <div className="hidden md:flex gap-4">
          {[
            { name: "Home", path: "/home" },
            { name: "Create", path: "/create" },
            { name: "My Recipes", path: "/myrecipes" },
            { name: "Favorites", path: "/favorites" },
            { name: "Liked", path: "/liked" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-3 py-2 rounded-lg font-medium transition kanit-light"
              style={{
                backgroundColor:
                  location.pathname === item.path ? colors.beige : "transparent",
                color: "black",
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* RIGHT — Login / Profile */}
        <div className="flex items-center gap-3 kanit-light">

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg font-medium kanit-light"
              style={{
                backgroundColor: colors.beige,
                color: "black",
                border: `2px solid ${colors.caramel}`,
              }}
            >
              Login
            </Link>
          ) : (
            <div className="dropdown dropdown-end kanit-light">
              <label tabIndex={0} className="cursor-pointer">
                <FaUserCircle
                  className="text-4xl"
                  style={{ color: "black" }}
                />
              </label>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 p-2 shadow-md rounded-xl w-40 kanit-light"
                style={{
                  backgroundColor: colors.cream,
                  border: `2px solid ${colors.tan}`,
                  color: "black",
                }}
              >
                <li>
                  <Link to="/profile" className="kanit-light">
                    Profile
                  </Link>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="kanit-light"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

        </div>

      </div>
    </motion.nav>
  );
};

export default Navbar;
