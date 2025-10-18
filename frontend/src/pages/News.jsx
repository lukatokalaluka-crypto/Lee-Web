import React, { useEffect, useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";

export default function News() {
  const [newsPosts, setNewsPosts] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await API.get("/api/posts?category=News");
        if (Array.isArray(data)) {
          setNewsPosts(data);
        } else if (data.posts) {
          setNewsPosts(data.posts);
        } else {
          setNewsPosts([]);
        }
      } catch (err) {
        console.error(err);
        setNewsPosts([]);
      }
    };
    fetchNews();
  }, []);

  return (
    <>
      {/* Spacer to push content below fixed navbar */}
      <div style={{ height: "160px" }} />

      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="fw-bold display-6">📰 Latest News</h2>
          <p className="lead text-muted">
            Stay informed with updates, stories, and highlights from the New Generation community.
          </p>
          <hr className="w-25 mx-auto" />
        </div>

        {/* News Posts */}
        {newsPosts.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {newsPosts.map((post) => (
              <div key={post._id} className="col">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center">No news posts available.</div>
        )}
      </div>
    </>
  );
}
