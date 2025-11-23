import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  getFavorites,
  getUserRecipes,
  getUserStats,
  deleteAccount,
  updateProfile
} from "../controllers/usersController.js";

import { protect } from "../middleware/auth.js";
import { getMyRecipes } from "../controllers/recipesController.js";
import { uploadProfile } from "../middleware/uploadProfile.js";
import { forgotPassword, resetPassword } from "../controllers/usersController.js";



const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router.get("/profile", protect, getProfile);

router.put("/profile", protect,uploadProfile.single("profileImage"),updateProfile);

router.get("/favorites", protect, getFavorites);
router.get("/my-recipes", protect, getMyRecipes);
router.get("/:id/recipes", getUserRecipes);

router.get("/me/stats", protect, getUserStats);

router.delete("/delete", protect, deleteAccount);

export default router;
