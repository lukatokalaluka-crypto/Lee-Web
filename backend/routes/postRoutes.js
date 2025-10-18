import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getCategories, // ✅ added
} from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer(); // in-memory storage

// Routes
router.post("/", protect, upload.fields([{ name: "image" }, { name: "media" }]), createPost);
router.get("/", getPosts);
router.get("/categories", getCategories); // ✅ added
router.get("/:id", getPostById);
router.put("/:id", protect, upload.fields([{ name: "image" }, { name: "media" }]), updatePost);
router.delete("/:id", protect, deletePost);

export default router;
