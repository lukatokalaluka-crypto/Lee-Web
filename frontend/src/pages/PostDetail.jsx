import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaDownload, FaArrowLeft } from "react-icons/fa";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [showShareModal, setShowShareModal] = useState(false);

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

        const resp = await API.get(`/api/posts/${id}`);
        const data = resp?.data;
        if (mounted) setPost(data);
      } catch (err) {
        console.error("Post fetch error:", err);
        if (mounted) setLoadError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const formattedDate = post ? new Date(post.createdAt).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) : '';

  const isAudio = post?.fileUrl?.match(/\.(mp3|wav|ogg)$/i);
  const isVideo = post?.fileUrl?.match(/\.(mp4|mov|webm)$/i);

  const playSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handlePlay = () => {
    playSound();
  };

  const getPostUrl = () => `${window.location.origin}/posts/${id}`;

  const shareOnFacebook = () => {
    const url = encodeURIComponent(getPostUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener");
    setShowShareModal(false);
  };

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(getPostUrl());
    window.open(`https://wa.me/?text=${url}`, "_blank", "noopener");
    setShowShareModal(false);
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(getPostUrl());
    window.open(`https://twitter.com/intent/tweet?url=${url}`, "_blank", "noopener");
    setShowShareModal(false);
  };

  const shareNative = async () => {
    const url = getPostUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content?.substring(0, 100) + '...',
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
    setShowShareModal(false);
  };

  if (loading) {
    return (
      <div className="home-background" style={{ minHeight: "100vh" }}>
        <div style={{ height: "120px" }} />
        <div className="container py-5">
          <div className="d-flex justify-content-center">
            <div className="modern-spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !post) {
    return (
      <div className="home-background" style={{ minHeight: "100vh" }}>
        <div style={{ height: "120px" }} />
        <div className="container py-5">
          <div className="alert alert-danger text-center">
            {loadError || "Post not found"}
          </div>
          <div className="text-center mt-3">
            <Link to="/" className="btn btn-primary">
              <FaArrowLeft className="me-2" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-background" style={{ minHeight: "100vh" }}>
      <div style={{ height: "120px" }} />

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            {/* Back Button */}
            <div className="mb-4">
              <Link to="/" className="btn btn-outline-light">
                <FaArrowLeft className="me-2" /> Back to Home
              </Link>
            </div>

            {/* Post Header */}
            <div className="card shadow-lg border-0 mb-4" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-start gap-4 mb-4">
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      style={{
                        width: 200,
                        height: 150,
                        objectFit: "cover",
                        borderRadius: 8,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    />
                  )}
                  <div className="flex-grow-1">
                    <h1 className="display-5 fw-bold mb-3" style={{ color: "#333" }}>
                      {post.title}
                    </h1>
                    <div className="d-flex flex-wrap gap-3 mb-3">
                      <span className="badge bg-info fs-6 px-3 py-2">
                        {post.category || "General"}
                      </span>
                      {post.featured && (
                        <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="text-muted">
                      <FaUser className="me-2" />
                      {post.author?.name || "Unknown"} &nbsp; • &nbsp;
                      <FaCalendarAlt className="me-2" />
                      {formattedDate}
                    </div>
                  </div>
                </div>

                {/* Share Button */}
                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => setShowShareModal(true)}
                  >
                    Share Post
                  </button>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="card shadow-lg border-0" style={{ background: "rgba(255,255,255,0.95)" }}>
              <div className="card-body p-5">
                <div className="row">
                  <div className="col-12 col-md-8">
                    <div style={{ lineHeight: 1.8, fontSize: "1.1rem", color: "#222" }}>
                      <p className="lead mb-4">{post.content}</p>

                      {post.description && (
                        <div className="mb-4">
                          <h4 className="fw-bold mb-3">Overview</h4>
                          <p className="text-muted">{post.description}</p>
                        </div>
                      )}

                      {post.details && (
                        <div className="mb-4">
                          <h4 className="fw-bold mb-3">Details</h4>
                          <div className="text-muted" style={{ whiteSpace: "pre-wrap" }}>
                            {post.details}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    {post.tags?.length > 0 && (
                      <div className="mb-4">
                        <h5 className="fw-bold mb-3">Tags</h5>
                        <div>
                          {post.tags.map((tag, i) => (
                            <span key={i} className="badge bg-secondary me-2 mb-2">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {post.fileUrl && (
                      <div className="mb-4">
                        <h5 className="fw-bold mb-3">Media</h5>
                        {isAudio && (
                          <audio
                            ref={audioRef}
                            controls
                            className="w-100"
                            onPlay={handlePlay}
                          >
                            <source src={post.fileUrl} type="audio/mpeg" />
                          </audio>
                        )}
                        {isVideo && (
                          <video
                            ref={videoRef}
                            controls
                            className="w-100"
                            style={{ maxHeight: 300, objectFit: "cover" }}
                            onPlay={handlePlay}
                          >
                            <source src={post.fileUrl} type="video/mp4" />
                          </video>
                        )}
                        <a
                          href={post.fileUrl}
                          download
                          className="btn btn-outline-primary w-100 mt-3"
                        >
                          <FaDownload className="me-2" /> Download
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Share "{post.title}"</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowShareModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                    onClick={shareOnFacebook}
                  >
                    <i className="fab fa-facebook-f me-2"></i>
                    Share on Facebook
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-success d-flex align-items-center justify-content-center"
                    onClick={shareOnWhatsApp}
                  >
                    <i className="fab fa-whatsapp me-2"></i>
                    Share on WhatsApp
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-info d-flex align-items-center justify-content-center"
                    onClick={shareOnTwitter}
                  >
                    <i className="fab fa-twitter me-2"></i>
                    Share on Twitter
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                    onClick={shareNative}
                  >
                    <i className="fas fa-share-alt me-2"></i>
                    More Options
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
