import express from "express";
import recipeRoutes from "./routes/recipeRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import path from "path";
import contactRoutes from "../src/routes/contactRoutes.js"

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5001

const allowedOrigins = [
  "http://localhost:5173", // Vite default
  "http://127.0.0.1:5173",
  "http://localhost:5174", // ← your current frontend port
  "https://your-frontend-domain.com" // production
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman) or from allowed origins
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
const __dirname = path.resolve();

// PUBLIC folder for images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json())
app.use(rateLimiter)

app.use("/api/recipes",recipeRoutes)
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);



connectDB().then(() => {
  app.listen(5001, () => {
    console.log("Server started on port: ",PORT);
  });
})



