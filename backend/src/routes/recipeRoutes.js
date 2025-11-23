import express from "express";
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
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
import uploadRecipe from "../middleware/uploadRecipe.js"; 

const router = express.Router();

router.get("/my", protect, getMyRecipes);
router.get("/favorites", protect, getFavoriteRecipes);
router.get("/liked", protect, getLikedRecipes);
router.get("/", getAllRecipes);


 
router.post("/", protect, uploadRecipe, createRecipe);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);

router.post("/:id/like", protect, toggleLike);
router.post("/:id/favorite", protect, toggleFavorite);

router.get("/", getRecipes);
router.get("/:id", getRecipe);

export default router;
