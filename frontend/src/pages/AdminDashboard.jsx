import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import api from "../services/api";

export default function AdminDashboard({ onLogout }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("news");
  const [featured, setFeatured] = useState(false);
  const [image, setImage] = useState(null);
  const [media, setMedia] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/posts");
      setPosts(data || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Drag-and-drop image
  const onDropImage = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);
  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
    useDropzone({
      onDrop: onDropImage,
      accept: { "image/*": [] },
      multiple: false,
    });

  // Drag-and-drop media
  const onDropMedia = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setMedia(file);
    setMediaPreview(URL.createObjectURL(file));
  }, []);
  const { getRootProps: getMediaRootProps, getInputProps: getMediaInputProps } =
    useDropzone({
      onDrop: onDropMedia,
      accept: { "audio/*": [], "video/*": [] },
      multiple: false,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("featured", featured ? "true" : "false");
      if (image) formData.append("image", image);
      if (media) formData.append("media", media);

      if (editingPost) {
        await api.put(`/api/posts/${editingPost._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Post updated successfully!");
        setEditingPost(null);
      } else {
        await api.post("/api/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Post created successfully!");
      }

      // Reset form
      setTitle("");
      setContent("");
      setCategory("news");
      setFeatured(false);
      setImage(null);
      setMedia(null);
      setImagePreview(null);
      setMediaPreview(null);

      fetchPosts();
    } catch (err) {
      console.error("Error saving post:", err.response?.data || err.message);
      alert("❌ Failed to save post.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/api/posts/${id}`);
      alert("✅ Post deleted successfully!");
      fetchPosts();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert("❌ Failed to delete post.");
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setFeatured(post.featured);
    setImagePreview(post.featuredImage || null);
    setMediaPreview(post.fileUrl || null);
    setImage(null);
    setMedia(null);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setTitle("");
    setContent("");
    setCategory("news");
    setFeatured(false);
    setImage(null);
    setMedia(null);
    setImagePreview(null);
    setMediaPreview(null);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.category?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDateTime = (iso) => {
    try {
      const d = new Date(iso);
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } catch {
      return "";
    }
  };

  return (
    // Add top padding so content does not sit under a fixed navbar.
    // Adjust paddingTop value to match your navbar height (e.g., 64-96px).
    <div className="admin-dashboard" style={{ paddingTop: "80px" }}>
      <div className="container mt-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0">Admin Dashboard</h2>
            <small className="text-muted">Manage posts, media and categories</small>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-secondary" onClick={fetchPosts} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button className="btn btn-danger" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="row">
          {/* Left column Create/Edit Form */}
          <div className="col-12 col-lg-5 mb-4">
            <div className="card shadow-sm border-0 rounded-3">
              <div className={`card-header ${editingPost ? "bg-warning" : "bg-primary"} text-white rounded-top`}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{editingPost ? "Edit Post" : "Create New Post"}</h5>
                  {editingPost && (
                    <button className="btn btn-sm btn-light" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="form-control form-control-lg mb-3"
                  />
                  <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="form-control mb-3"
                    rows={6}
                  />
                  <div className="d-flex gap-2 mb-3">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="form-select"
                    >
                      <option value="news">News</option>
                      <option value="music">Music</option>
                      <option value="video">Video</option>
                      <option value="blog">Blog</option>
                    </select>

                    <div className="form-check d-flex align-items-center ms-2">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        id="featuredCheck"
                      />
                      <label className="form-check-label" htmlFor="featuredCheck">
                        Featured
                      </label>
                    </div>
                  </div>

                  {/* Image Dropzone */}
                  <div
                    {...getImageRootProps()}
                    className="mb-3 p-3 border rounded-3 text-center bg-light"
                    style={{ cursor: "pointer", borderStyle: "dashed" }}
                  >
                    <input {...getImageInputProps()} />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxHeight: "110px" }}
                      />
                    ) : (
                      <div>
                        <strong>Upload featured image</strong>
                        <div className="text-muted small">PNG, JPG, GIF — click or drag</div>
                      </div>
                    )}
                  </div>

                  {/* Media Dropzone */}
                  <div
                    {...getMediaRootProps()}
                    className="mb-3 p-3 border rounded-3 text-center bg-light"
                    style={{ cursor: "pointer", borderStyle: "dashed" }}
                  >
                    <input {...getMediaInputProps()} />
                    {mediaPreview ? (
                      <div className="d-flex justify-content-center align-items-center">
                        {mediaPreview.match(/\.(mp3|wav|ogg)$/i) ? (
                          <audio controls style={{ width: "100%" }}>
                            <source src={mediaPreview} />
                          </audio>
                        ) : mediaPreview.match(/\.(mp4|mov|webm)$/i) ? (
                          <video controls style={{ maxHeight: "160px", width: "100%" }}>
                            <source src={mediaPreview} />
                          </video>
                        ) : (
                          <p className="mb-0 text-truncate" style={{ maxWidth: "200px" }}>
                            {mediaPreview.split("/").pop()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <strong>Upload media</strong>
                        <div className="text-muted small">Audio or video — click or drag</div>
                      </div>
                    )}
                  </div>

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary btn-lg">
                      {editingPost ? "Update Post" : "Create Post"}
                    </button>
                    {editingPost && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel Editing
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right column Posts List */}
          <div className="col-12 col-lg-7">
            <div className="d-flex mb-3 align-items-center gap-3">
              <input
                type="text"
                placeholder="Search posts by title or category..."
                className="form-control form-control-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="text-end" style={{ minWidth: "140px" }}>
                <div className="small text-muted">Total posts</div>
                <div className="fw-bold">{posts.length}</div>
              </div>
            </div>

            <div className="row row-cols-1 row-cols-md-2 g-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div key={post._id} className="col">
                    <div className="card h-100 shadow-sm border-0 rounded-3">
                      {post.featuredImage && (
                        <div style={{ height: "160px", overflow: "hidden", borderTopLeftRadius: ".75rem", borderTopRightRadius: ".75rem" }}>
                          <img
                            src={post.featuredImage}
                            className="card-img-top"
                            alt={post.title}
                            style={{ objectFit: "cover", width: "100%", height: "160px" }}
                          />
                        </div>
                      )}
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title fw-bold text-truncate" title={post.title}>
                          {post.title}
                        </h6>
                        <p className="card-text text-muted small mb-2" style={{ maxHeight: "56px", overflow: "hidden" }}>
                          {post.content}
                        </p>

                        <div className="d-flex gap-2 mb-2">
                          <span className="badge bg-secondary">{post.category}</span>
                          {post.featured && <span className="badge bg-warning text-dark">Featured</span>}
                        </div>

                        {/* Media preview in card */}
                        {post.fileUrl?.match(/\.(mp3|wav|ogg)$/i) && (
                          <audio controls className="w-100 mb-2">
                            <source src={post.fileUrl} />
                          </audio>
                        )}
                        {post.fileUrl?.match(/\.(mp4|mov|webm)$/i) && (
                          <video controls className="w-100 mb-2" style={{ maxHeight: "180px" }}>
                            <source src={post.fileUrl} />
                          </video>
                        )}

                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {post.author?.name || "Unknown"}
                          </small>
                          <small className="text-muted">{formatDateTime(post.createdAt)}</small>
                        </div>

                        <div className="d-flex gap-2 mt-3">
                          <button
                            className="btn btn-sm btn-outline-warning w-50"
                            onClick={() => handleEdit(post)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger w-50"
                            onClick={() => handleDelete(post._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col">
                  <div className="alert alert-info mb-0">No posts found.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
