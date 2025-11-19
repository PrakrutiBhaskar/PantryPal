import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load user from DB
    const foundUser = await User.findById(decoded.id).select("-password");

    if (!foundUser) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = foundUser;

    next();
  } catch (error) {
    console.error("JWT ERROR:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};
