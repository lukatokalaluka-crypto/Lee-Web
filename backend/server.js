import dotenv from "dotenv";
dotenv.config(); // must be at the very top

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
console.log("Cloudinary Key:", process.env.CLOUDINARY_API_KEY); // test
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
