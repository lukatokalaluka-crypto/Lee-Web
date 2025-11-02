import React, { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

const PostCard = lazy(() => import("../components/PostCard"));

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        // dynamic import to avoid dev-time module resolution crashes
        const apiModule = await import("../services/api").catch((err) => {
          throw new Error(`Failed to load API module: ${err.message}`);
        });
        const API = apiModule?.default || apiModule;
        if (!API || typeof API.get !== "function") {
          throw new Error("API module does not export a default axios-like instance");
        }

        const resp = await API.get("/api/posts?featured=true");
        const data = resp?.data;
        let posts = [];
        if (Array.isArray(data)) posts = data;
        else if (data?.posts) posts = data.posts;
        else posts = Array.isArray(resp) ? resp : [];
        if (mounted) setFeatured(posts);
      } catch (err) {
        console.error("Home fetch error:", err);
        if (mounted) setLoadError(err.message || String(err));
        if (mounted) setFeatured([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const getPostUrl = (id) => `${window.location.origin}/posts/${id}`;
  const shareOnFacebook = (id) => {
    const url = encodeURIComponent(getPostUrl(id));
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener");
  };
  const shareOnWhatsApp = (id) => {
    const url = encodeURIComponent(getPostUrl(id));
    window.open(`https://wa.me/?text=${url}`, "_blank", "noopener");
  };
  const shareOnTwitter = (id) => {
    const url = encodeURIComponent(getPostUrl(id));
    window.open(`https://twitter.com/intent/tweet?url=${url}`, "_blank", "noopener");
  };
  const shareNative = async (id) => {
    const url = getPostUrl(id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this post',
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copy link
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      } catch {
        alert("Unable to copy link");
      }
    }
  };
  const copyLink = async (id) => {
    try {
      await navigator.clipboard.writeText(getPostUrl(id));
      alert("Link copied to clipboard");
    } catch {
      alert("Unable to copy link");
    }
  };

  const filteredPosts = featured.filter(
    (post) =>
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="home-background" style={{ minHeight: "100vh" }}>
        <div style={{ height: "120px" }} />

        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="lee-web-title">LEE-WEB</h1>
            <h2 className="fw-bold display-5 text-white" style={{ marginTop: "20px" }}>HOME OF AFRICAN TUNES</h2>
            <p className="lead text-white">
              Discover the latest in music, news, biographies, and videos.
            </p>
            <hr className="w-25 mx-auto" />
          </div>

        <div className="mb-4">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="🔍 Search posts by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <h3 className="fw-semibold">🎧 Featured Posts</h3>
        </div>

        {loading && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {loadError && (
          <div className="alert alert-danger">
            Error loading posts. Check console for details.
          </div>
        )}

        {!loading && !loadError && filteredPosts.length === 0 && (
          <div className="alert alert-info text-center">No matching posts found.</div>
        )}

        {!loading && !loadError && filteredPosts.length > 0 && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {filteredPosts.map((post) => (
              <div key={post._id} className="col">
                <div className="card h-100 border-0">
                  <Link to={`/posts/${post._id}`} className="text-decoration-none text-dark">
                    <Suspense fallback={<div style={{ height: 160, background: "#f5f5f5" }} />}>
                      <PostCard post={post} />
                    </Suspense>
                  </Link>

                  <div className="card-body pt-2">
                    <div className="d-flex gap-2 flex-wrap">
                      <Link to={`/posts/${post._id}`} className="btn btn-sm btn-outline-primary">
                        View
                      </Link>

                      {post.fileUrl && (
                        <a
                          href={post.fileUrl}
                          className="btn btn-sm btn-outline-success"
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      )}

                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary dropdown-toggle"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Share
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => shareOnFacebook(post._id)}
                            >
                              Facebook
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => shareOnWhatsApp(post._id)}
                            >
                              WhatsApp
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => shareOnTwitter(post._id)}
                            >
                              Twitter
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => shareNative(post._id)}
                            >
                              More Options
                            </button>
                          </li>
                        </ul>
                      </div>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-info"
                        onClick={() => copyLink(post._id)}
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </>
  );
}
