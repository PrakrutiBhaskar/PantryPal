import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    ingredients: { type: Array, required: true },
    steps: { type: Array, required: true },
    cuisine: { type: String },
    dietType: { type: String },
    cookingTime: { type: Number },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    favorites: [{type: mongoose.Schema.Types.ObjectId, ref: "User", default: [],},],

    // ⭐ Image paths stored here
    images: [{ type: String }],

    // Linking the recipe to a user
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);

