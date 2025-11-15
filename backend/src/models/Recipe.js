import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    ingredients: { type: String, required: true },
    steps: { type: String, required: true },
    cuisine: String,
    dietType: { type: String, default: "" },
    cookingTime: Number,

    images: [String],

    // 🟢 REQUIRED FOR LIKE SYSTEM
    likes: { type: Number, default: 0 },

    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    // OPTIONAL: favorites if needed here
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User",
  required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);
