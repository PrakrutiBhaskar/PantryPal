// usersController.js
import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import { generateToken } from "../utils/generateToken.js";

// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    // Fetch user
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch user recipes for stats
    const userRecipes = await Recipe.find({ user: req.user._id });

    // Total likes count
    const totalLikes = userRecipes.reduce(
      (sum, recipe) => sum + (recipe.likes?.length || 0),
      0
    );

    // Total favorites count
    const totalFavorites = userRecipes.reduce(
      (sum, recipe) => sum + (recipe.favorites?.length || 0),
      0
    );

    const profileData = {
      ...user.toObject(),
      stats: {
        recipesCreated: userRecipes.length,
        totalLikes,
        totalFavorites,
      },
    };

    return res.status(200).json(profileData);

  } catch (error) {
    console.error("❌ Error loading profile:", error);
    return res.status(500).json({ message: "Server error loading profile" });
  }
};



export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserRecipes = async (req, res) => {
  try {
    const userId = req.params.id;

    // check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // fetch user's recipes
    const recipes = await Recipe.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      username: user.name,
      totalRecipes: recipes.length,
      recipes,
    });
  } catch (error) {
    console.error("❌ Error fetching user recipes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logged-in user's recipe, like, and favorite stats
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    const recipes = await Recipe.find({ user: userId });
    const totalRecipes = recipes.length;

    const totalLikes = recipes.reduce((sum, recipe) => sum + recipe.likes, 0);
    const totalFavorites = user.favorites.length;

    res.status(200).json({
      totalRecipes,
      totalLikes,
      totalFavorites,
    });
  } catch (error) {
    console.error("❌ Error fetching user stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete user account and all their recipes
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all recipes by user
    await Recipe.deleteMany({ user: userId });

    // Delete user record
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Your account and all recipes have been deleted." });
  } catch (error) {
    console.error("❌ Error deleting account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = req.user;

    const updates = {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
    };

    if (req.file) {
      updates.profileImage = `uploads/profile/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updates,
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error updating profile" });
  }
};
