import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreatePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    steps: "",
    cuisine: "",
    dietType: "",
    cookingTime: "",
  });

  const [images, setImages] = useState([]);

  // Handle text field updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle multiple file uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔐 Validate login before submitting
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to create a recipe.");
      return navigate("/login");
    }

    // 📝 Validate required fields
    if (
      !formData.title.trim() ||
      !formData.ingredients.trim() ||
      !formData.steps.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Add text fields
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      // Add image files
      images.forEach((img) => formDataToSend.append("images", img));

      const res = await fetch("http://localhost:5001/api/recipes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Recipe created successfully! 🍳");
        navigate("/home");
      } else {
        toast.error(data.message || "Failed to create recipe.");
      }
    } catch (error) {
      console.error("❌ Error creating recipe:", error);
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create a New Recipe 🍽️
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Title */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Recipe Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Creamy Pasta"
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Ingredients *
          </label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="List ingredients separated by commas"
            rows={3}
            className="textarea textarea-bordered w-full"
            required
          />
        </div>

        {/* Steps */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Preparation Steps *
          </label>
          <textarea
            name="steps"
            value={formData.steps}
            onChange={handleChange}
            placeholder="Describe the steps to make your dish"
            rows={5}
            className="textarea textarea-bordered w-full"
            required
          />
        </div>

        {/* Cuisine */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Cuisine</label>
          <input
            type="text"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            placeholder="e.g., Italian, Indian, Chinese"
            className="input input-bordered w-full"
          />
        </div>

        {/* Diet Type */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Diet Type</label>
          <select
            name="dietType"
            value={formData.dietType}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Select one</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Non-Vegetarian">Non-Vegetarian</option>
            <option value="Keto">Keto</option>
            <option value="Gluten-Free">Gluten-Free</option>
          </select>
        </div>

        {/* Cooking Time */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Cooking Time (mins)
          </label>
          <input
            type="number"
            name="cookingTime"
            value={formData.cookingTime}
            onChange={handleChange}
            placeholder="e.g., 30"
            className="input input-bordered w-full"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Upload Images</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* Preview */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {images.map((img, index) => (
              <img
                key={index}
                src={URL.createObjectURL(img)}
                alt={`Preview ${index + 1}`}
                className="w-32 h-32 object-cover rounded-lg shadow"
              />
            ))}
          </div>
        )}

        {/* Submit */}
        <button className="btn btn-primary mt-6 text-lg w-full">
          Submit Recipe
        </button>
      </form>
    </div>
  );
};

export default CreatePage;
