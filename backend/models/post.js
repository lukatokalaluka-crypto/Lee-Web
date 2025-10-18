import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },

    // Broad category for filtering (e.g. Music, News, Video)
    category: { type: String, required: true },

    // Optional type for internal grouping (can be removed if redundant)
    type: { type: String, enum: ["news", "music", "video"], default: "news" },

    // Optional tags for search and discovery
    tags: [{ type: String }],

    // Featured flag for homepage or spotlight
    featured: { type: Boolean, default: false },

    // Media assets
    featuredImage: { type: String }, // Cloudinary image
    fileUrl: { type: String },       // Cloudinary media (audio/video)

    // Author reference
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
