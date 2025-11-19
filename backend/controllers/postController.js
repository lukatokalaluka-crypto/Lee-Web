import dotenv from "dotenv";
dotenv.config(); // must be at the very top




import Post from "../models/post.js";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: Upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder, resource_type = "image") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder, resource_type },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });

// Create Post
export const createPost = async (req, res) => {
  try {
    const { title, content, category, featured, tags } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized, login first" });
    }

    let featuredImage = "";
    let fileUrl = "";

    if (req.files?.image) {
      const result = await uploadToCloudinary(
        req.files.image[0].buffer,
        "new-gen-music/images",
        "image"
      );
      featuredImage = result.secure_url;
    }

    if (req.files?.media) {
      const result = await uploadToCloudinary(
        req.files.media[0].buffer,
        "new-gen-music/media",
        "auto"
      );
      fileUrl = result.secure_url;
    }

    const post = await Post.create({
      title,
      content,
      category,
      featured: featured === "true",
      tags: tags?.split(",").map(t => t.trim()), // ✅ tag support
      featuredImage,
      fileUrl,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get all posts with optional category & search filters
export const getPosts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    // Case-insensitive category match
    if (category) {
      filter.category = new RegExp(`^${category}$`, "i");
    }

    // Search by title or content
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await Post.find(filter)
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Get Posts Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all unique categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Post.distinct("category");
    res.json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all unique tags
export const getTags = async (req, res) => {
  try {
    const tags = await Post.distinct("tags");
    res.json(tags);
  } catch (error) {
    console.error("Get Tags Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single post
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name");
    post ? res.json(post) : res.status(404).json({ message: "Post not found" });
  } catch (error) {
    console.error("Get Post By ID Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const { title, content, category, featured, tags } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.featured =
      featured !== undefined ? featured === "true" : post.featured;
    post.tags = tags ? tags.split(",").map(t => t.trim()) : post.tags; // ✅ tag support

    if (req.files?.image) {
      const result = await uploadToCloudinary(
        req.files.image[0].buffer,
        "new-gen-music/images",
        "image"
      );
      post.featuredImage = result.secure_url;
    }

    if (req.files?.media) {
      const result = await uploadToCloudinary(
        req.files.media[0].buffer,
        "new-gen-music/media",
        "auto"
      );
      post.fileUrl = result.secure_url;
      post.originalFilename = req.files.media[0].originalname;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error("Update Post Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await post.deleteOne();
    res.json({ message: "Post removed" });
  } catch (error) {
    console.error("Delete Post Error:", error);
    res.status(500).json({ message: error.message });
  }
};
