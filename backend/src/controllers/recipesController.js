import Recipe from "../models/Recipe.js";
import User from "../models/User.js"; // assuming you have this
// escape Regex util
function escapeRegex(str = "") {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/recipes/:id
export async function getRecipe(req, res) {
  try {
    // Fetch a single recipe with user details populated
    const recipe = await Recipe.findById(req.params.id)
      .populate("user", "name email");

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error("error in getRecipe controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


// POST /api/recipes  (create)
export const createRecipe = async (req, res) => {
  try {
    console.log("📦 req.body:", req.body);
    console.log("🖼️ req.files:", req.files);

    const {  title, ingredients, steps, cuisine, dietType, cookingTime } = req.body;

    if (!title || !ingredients || !steps) {
      return res.status(400).json({ message: "Title, ingredients, and steps are required" });
    }

    // map file paths (diskStorage gives .path)
    const imagePaths = (req.files || []).map((f) => {
      const full = f.path || f.filename || "";
      const parts = full.split(/[/\\]/); // handle windows/backslash
      const filename = parts.slice(-1)[0];
      return `uploads/${filename}`;
    });

    const recipe = await Recipe.create({
      title: title.trim(),
      ingredients,
      steps,
      cuisine: cuisine || "",
      dietType: dietType || "",
      cookingTime: cookingTime ? Number(cookingTime) : 0,
      images: imagePaths,
      user: req.user ? req.user._id : undefined,
    });

    res.status(201).json({ message: "Recipe created successfully 🎉", recipe });
  } catch (err) {
    console.error("❌ Error creating recipe:", err);
    res.status(500).json({ message: "Server error creating recipe" });
  }
};

// PUT /api/recipes/:id
export const updateRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;

    // 1. Find recipe first
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // 2. Check ownership
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to update this recipe" });
    }

    // 3. Apply updates
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, { new: true });

    res.status(200).json({
      message: "Recipe updated successfully",
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.error("❌ Error updating recipe:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE /api/recipes/:id
export async function deleteRecipe(req, res) {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("error in deleteRecipe controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/recipes/:id/favorite  -> toggle favorite in user's favorites array
export const toggleFavorite = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const idx = user.favorites.findIndex((r) => r.equals(recipeId));
    if (idx === -1) {
      user.favorites.push(recipeId);
      await user.save();
      return res.json({ message: "Recipe added to favorites" });
    } else {
      user.favorites.splice(idx, 1);
      await user.save();
      return res.json({ message: "Recipe removed from favorites" });
    }
  } catch (error) {
    console.error("toggleFavorite error:", error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/recipes/:id/like  -> toggle like on recipe
export const toggleLike = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user._id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    if (!Array.isArray(recipe.likedBy)) recipe.likedBy = [];

    // use equals() for ObjectId comparison
    const alreadyLiked = recipe.likedBy.some((id) => id.equals(userId));

    if (!alreadyLiked) recipe.likedBy.push(userId);
    else recipe.likedBy = recipe.likedBy.filter((id) => !id.equals(userId));

    recipe.likes = recipe.likedBy.length;
    await recipe.save();

    res.json({ message: alreadyLiked ? "Like removed" : "Recipe liked", likes: recipe.likes });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET /api/recipes  -> filtered & paginated (WORD match)
export const getRecipes = async (req, res) => {
  try {
    const {
      search,
      cuisine,
      dietType,
      maxTime,
      ingredients,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const conditions = [];

    // WORD MATCH (whole word) - case INSENSITIVE
    // We'll use \bword\b so "ca" won't match "pancakes".
    if (search?.trim()) {
      const safe = escapeRegex(search.trim());
      const wordRegex = new RegExp(`\\b${safe}\\b`, "i");

      conditions.push({
        $or: [
          { title: { $regex: wordRegex } },
          { ingredients: { $regex: wordRegex } },
          { steps: { $regex: wordRegex } },
          { cuisine: { $regex: wordRegex } },
          { dietType: { $regex: wordRegex } },
        ],
      });
    }

    if (dietType?.trim()) {
        conditions.push({
          dietType: {
            $regex: `^${escapeRegex(dietType.trim())}$`,
            $options: "i",
          },
        });
      }


    // Ingredients filter: match any of the provided words as whole words
    if (ingredients?.trim()) {
      const list = ingredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      if (list.length > 0) {
        conditions.push({
          ingredients: {
            $all: list.map((i) => new RegExp(`\\b${escapeRegex(i)}\\b`, "i")),
          },
        });
      }
    }

    // Cuisine (exact-ish, case-insensitive) - match as whole word or exact
    if (cuisine?.trim()) {
      const re = new RegExp(`\\b${escapeRegex(cuisine.trim())}\\b`, "i");
      conditions.push({ cuisine: { $regex: re } });
    }
    // Max cooking time
    if (maxTime && !isNaN(maxTime)) {
      conditions.push({ cookingTime: { $lte: Number(maxTime) } });
    }

    const filter = conditions.length > 0 ? { $and: conditions } : {};

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "likes") sortOption = { likes: -1 };
    if (sort === "time") sortOption = { cookingTime: 1 };

    const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit));

    const [recipes, total] = await Promise.all([
      Recipe.find(filter).populate("user", "name email").sort(sortOption).skip(skip).limit(Number(limit)),
      Recipe.countDocuments(filter),
    ]);

    res.status(200).json({
      recipes,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("❌ Error in getRecipes:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// GET /api/recipes/my -> user's recipes
export const getMyRecipes = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Logged-in user:", req.user._id);

    const recipes = await Recipe.find({ user: userId }).populate("user", "name email").sort({ createdAt: -1 });

    return res.status(200).json(recipes);
  } catch (error) {
    console.error("🔥 Error in getMyRecipes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFavoriteRecipes = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: "favorites",
      populate: { path: "user", select: "name email" },
    });

    if (!user || user.favorites.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(user.favorites);
  } catch (error) {
    console.error("❌ Error fetching favorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/recipes/liked
export const getLikedRecipes = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find recipes where this user liked it
    const likedRecipes = await Recipe.find({ likedBy: userId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(likedRecipes);
  } catch (error) {
    console.error("❌ Error fetching liked recipes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
