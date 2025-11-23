import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

const PALETTE = {
  beige: "#F3D79E",
  brown: "#B57655",
  cream: "#F7EEDB",
  tan: "#E7D2AC",
  nude: "#D0B79A",
  caramel: "#BA8C73",
};

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const routes = [
    { name: "Home", path: "/home" },
    { name: "Create", path: "/create" },
    { name: "My Recipes", path: "/myrecipes" },
    { name: "Favorites", path: "/favorites" },
    { name: "Liked", path: "/liked" },
  ];

  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem("token"));
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="sticky top-0 z-50 shadow-sm kanit-light"
        style={{
          background: `linear-gradient(120deg, ${PALETTE.cream}, ${PALETTE.tan})`,
        }}
      >
        <div className="px-6 md:px-12 h-16 flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/home"
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: PALETTE.brown }}
          >
            PantryPal
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex gap-4">
            {routes.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 rounded-lg font-medium transition"
                style={{
                  backgroundColor:
                    location.pathname === item.path ? PALETTE.beige : "transparent",
                  color: PALETTE.brown,
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4">

            {/* LOGGED OUT */}
            {!isLoggedIn && (
              <Link
                to="/login"
                className="px-5 py-2 rounded-lg font-medium"
                style={{
                  backgroundColor: PALETTE.beige,
                  color: PALETTE.brown,
                  border: `2px solid ${PALETTE.caramel}`,
                }}
              >
                Login
              </Link>
            )}

            {/* LOGGED IN */}
            {isLoggedIn && (
              <div className="relative dropdown dropdown-end">
                <label tabIndex={0} className="cursor-pointer">
                  <FaUserCircle
                    className="text-4xl"
                    style={{ color: PALETTE.brown }}
                  />
                </label>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 p-3 shadow-md rounded-xl w-40"
                  style={{
                    background: PALETTE.cream,
                    border: `1px solid ${PALETTE.tan}`,
                    color: PALETTE.brown,
                  }}
                >
                  <li>
                    <Link to="/profile" className="font-medium">
                      Profile
                    </Link>
                  </li>

                  <li>
                    <button onClick={handleLogout} className="font-medium">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* MOBILE MENU BTN */}
            <button
              className="md:hidden text-3xl"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: PALETTE.brown }}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="md:hidden px-6 py-4 shadow-lg kanit-light"
          style={{
            background: PALETTE.cream,
            borderBottom: `2px solid ${PALETTE.tan}`,
          }}
        >
          <div className="flex flex-col gap-3">

            {routes.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg"
                style={{
                  backgroundColor:
                    location.pathname === item.path ? PALETTE.beige : "white",
                  border: `1px solid ${PALETTE.tan}`,
                  color: PALETTE.brown,
                }}
              >
                {item.name}
              </Link>
            ))}

            {!isLoggedIn ? (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-center font-medium"
                style={{
                  backgroundColor: PALETTE.brown,
                  color: "white",
                }}
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="px-3 py-2 rounded-lg font-medium text-white"
                style={{ background: "#C62828" }}
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;
