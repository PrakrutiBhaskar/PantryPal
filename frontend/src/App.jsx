import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import RecipeDetailPage from "./pages/RecipeDetailPage.jsx";
import Footer from "./components/Footer.jsx";
import MyRecipes from "./pages/MyRecipes.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import EditRecipe from "./pages/EditPage.jsx";
import Favorites from "./pages/Favorites.jsx";
import LikedPage from "./pages/LikedPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-app">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreatePage /></ProtectedRoute>} />
        <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetailPage /></ProtectedRoute>} />
        <Route path="/myrecipes" element={<ProtectedRoute><MyRecipes /></ProtectedRoute>} />
        <Route path="/edit/:id"  element={<ProtectedRoute><EditRecipe /></ProtectedRoute>}/>
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>}/>
        <Route path="/liked" element={<ProtectedRoute><LikedPage /></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}/>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
