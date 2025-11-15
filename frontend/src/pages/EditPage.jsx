import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    steps: "",
    cuisine: "",
    dietType: "",
    cookingTime: "",
  });

  useEffect(() => {
    // Load existing recipe
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`${API_URL}/api/recipes/${id}`);
        const data = await res.json();

        if (res.ok) {
          setFormData({
            title: data.title,
            ingredients: data.ingredients,
            steps: data.steps,
            cuisine: data.cuisine,
            dietType: data.dietType,
            cookingTime: data.cookingTime,
          });
        } else {
          toast.error("Recipe not found");
          navigate("/my-recipes");
        }
      } catch (err) {
        toast.error("Error loading recipe");
      }
    };

    fetchRecipe();
  }, [id]);

  // Handle changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Recipe updated!");
        navigate(`/recipe/${id}`);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Recipe</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="input input-bordered w-full"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Recipe Title"
          required
        />

        <textarea
          className="textarea textarea-bordered w-full"
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          placeholder="Ingredients"
          rows={3}
          required
        />

        <textarea
          className="textarea textarea-bordered w-full"
          name="steps"
          value={formData.steps}
          onChange={handleChange}
          placeholder="Steps"
          rows={5}
          required
        />

        <input
          className="input input-bordered w-full"
          name="cuisine"
          value={formData.cuisine}
          onChange={handleChange}
          placeholder="Cuisine"
        />

        <select
          className="select select-bordered w-full"
          name="dietType"
          value={formData.dietType}
          onChange={handleChange}
        >
          <option value="">Select Diet</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
          <option value="Keto">Keto</option>
          <option value="Gluten-Free">Gluten-Free</option>
        </select>

        <input
          className="input input-bordered w-full"
          name="cookingTime"
          type="number"
          value={formData.cookingTime}
          onChange={handleChange}
          placeholder="Cooking Time (mins)"
        />

        <button type="submit" className="btn btn-primary w-full">
          Update Recipe
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
