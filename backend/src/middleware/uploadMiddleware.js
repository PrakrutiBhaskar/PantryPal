import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload folders exist
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync("uploads/profile")) fs.mkdirSync("uploads/profile");
if (!fs.existsSync("uploads/recipes")) fs.mkdirSync("uploads/recipes");

// Storage for recipe images
const recipeStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/recipes");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Storage for profile images
const profileStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/profile");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Recipe upload → multiple images
export const uploadRecipe = multer({ storage: recipeStorage }).array("images", 10);

// Profile upload → only one image
export const uploadProfile = multer({ storage: profileStorage });
