import React, { useEffect, useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (selectedCategory = category, term = searchTerm) => {
    try {
      setLoading(true);
      let url = "/api/posts"; // ✅ fixed base route
      const params = [];
      if (selectedCategory) params.push(`category=${selectedCategory}`);
      if (term) params.push(`search=${encodeURIComponent(term)}`);
      if (params.length > 0) url += `?${params.join("&")}`;

      const { data } = await API.get(url);
      setPosts(Array.isArray(data) ? data : data.posts || []);
    } catch (err) {
      console.error("Post fetch error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/api/posts/categories"); // ✅ fixed route
      setCategories(data);
    } catch (err) {
      console.error("Category fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPosts(); // initial load
  }, []);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    fetchPosts(selected, searchTerm);
  };

  const handleSearch = () => {
    fetchPosts(category, searchTerm);
  };

  return (
    <>
      <div style={{ height: "160px" }} />

      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6">📝 Blog</h2>
          <p className="lead text-muted">
            Explore stories, insights, and updates from the New Generation community.
          </p>
          <hr className="w-25 mx-auto" />
        </div>

        {/* Search & Filter */}
        <div className="row mb-4">
          <div className="col-12 col-md-4 mb-2 mb-md-0">
            <select
              className="form-select form-select-lg"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6 mb-2 mb-md-0">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="🔍 Search posts by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-2">
            <button className="btn btn-primary btn-lg w-100" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        {/* Posts */}
        {loading && <div className="text-center text-muted">Loading posts...</div>}

        {!loading && posts.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {posts.map((post) => (
              <div key={post._id} className="col">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="alert alert-info text-center">No posts available.</div>
          )
        )}
      </div>
    </>
  );
}
