// usersController.js
import Recipe from "../models/Recipe.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id },process.env.JWT_SECRET,{ expiresIn: "15m" });

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

    // HTML Template
    const htmlMessage = `
      <div style="padding: 20px; font-family: Arial;">
        <h2>Password Reset Request</h2>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>You have requested to reset your password.</p>
        <p>Click the link below to reset:</p>

        <a href="${resetURL}" 
           style="display:inline-block; padding:10px 20px; background:#B57655; color:white; text-decoration:none; border-radius:5px;">
           Reset Your Password
        </a>

        <p style="margin-top:20px;">If you didn't request this, ignore this email.</p>
        <p>– PantryPal Team</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "Reset Your Password - PantryPal",
      html: htmlMessage,
    });

    res.json({ message: "Reset link sent to your email" });

  } catch (error) {
    console.error("❌ Forgot password error:", error);
    res.status(500).json({ message: "Email could not be sent" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Invalid token" });

    user.password = password;  // hashed via pre-save hook
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset error:", error);
    res.status(500).json({ message: "Reset failed" });
  }
};



// Register a new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
  name: name.trim(),
  email,
  password
});

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


export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email that YOU receive
    const adminEmailTemplate = `
      <div style="font-family: Arial; padding: 20px;">
        <h2>📩 New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
    `;

    // Automatically respond to the user as well (optional)
    const userConfirmationTemplate = `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Thank You for Contacting PantryPal! 🙌</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>We received your message and will get back to you soon.</p>
        <p>Here is a copy of your message:</p>
        <blockquote>${message}</blockquote>
        <p>— PantryPal Support Team</p>
      </div>
    `;

    // Send email to YOU
    await sendEmail({
      to: process.env.CONTACT_RECEIVER, // your email address
      subject: "New Contact Form Submission",
      html: adminEmailTemplate,
    });

    // Send confirmation email to USER
    await sendEmail({
      to: email,
      subject: "We Received Your Message — PantryPal",
      html: userConfirmationTemplate,
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("❌ Contact form error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};
