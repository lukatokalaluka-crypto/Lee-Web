import React, { useEffect, useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get("/api/posts?featured=true");
        if (Array.isArray(data)) {
          setFeatured(data);
        } else if (data.posts) {
          setFeatured(data.posts);
        } else {
          setFeatured([]);
        }
      } catch (err) {
        console.error(err);
        setFeatured([]);
      }
    };
    fetchFeatured();
  }, []);

  // Filter posts by title or category
  const filteredPosts = featured.filter(
    (post) =>
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Spacer to push content below fixed navbar */}
      <div style={{ height: "160px" }} />

      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="fw-bold display-5">HOME OF AFRICAN TUNES</h1>
          <p className="lead text-muted">
            Discover the latest in music, news, biographies, and videos. The new wave of sound starts here.
          </p>
          <hr className="w-25 mx-auto" />
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="🔍 Search posts by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Featured Section */}
        <div className="mb-4">
          <h3 className="fw-semibold">🎧 Featured Posts</h3>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {filteredPosts.map((post) => (
              <div key={post._id} className="col">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center">No matching posts found.</div>
        )}
      </div>
    </>
  );
}
