import express from "express";
import recipeRoutes from "./routes/recipeRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import path from "path";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ CORS runs in ALL environments — both dev and production
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "https://pantrypal-hva6.onrender.com",  // ✅ your real frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server requests (no origin) and listed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked CORS origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight OPTIONS requests for all routes
app.options("*", cors());

const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(rateLimiter);

// ROUTES
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);

// PRODUCTION FRONTEND
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});