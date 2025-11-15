import express from "express";
import {
  createRecipe,
  deleteRecipe,
  getFavoriteRecipes,
  getLikedRecipes,
  getMyRecipes,
  getRecipe,
  getRecipes,
  toggleFavorite,
  toggleLike,
  updateRecipe,
} from "../controllers/recipesController.js";
import { protect } from "../middleware/auth.js";
import { uploadRecipe } from "../middleware/uploadMiddleware.js"; // expect named export

const router = express.Router();

router.get("/", getRecipes);
router.get("/my", protect, getMyRecipes);

router.get("/favorites", protect, getFavoriteRecipes);
router.get("/liked", protect, getLikedRecipes);
router.get("/:id", getRecipe);


// Single POST route — auth -> multer -> controller
router.post("/", protect, uploadRecipe, createRecipe);


router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);

router.post("/:id/like", protect, toggleLike);
router.post("/:id/favorite", protect, toggleFavorite);

export default router;
