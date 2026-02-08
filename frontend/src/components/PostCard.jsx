import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaDownload } from "react-icons/fa";

export default function PostCard({ post }) {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  if (!post) return null;

  const formattedDate = new Date(post.createdAt).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isAudio = post.fileUrl?.match(/\.(mp3|wav|ogg)$/i);
  const isVideo = post.fileUrl?.match(/\.(mp4|mov|webm)$/i);

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



  return (
    <>
      {/* Card */}
      <div
        className="card shadow-sm"
        style={{
          width: "220px",
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          marginBottom: "15px",
          height: "350px",
          cursor: "pointer",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        }}
        role="button"
        aria-label={`Open post ${post.title}`}
      >
        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            style={{
              width: "100%",
              height: "120px",
              objectFit: "cover",
            }}
          />
        )}

        <div className="card-body d-flex flex-column" style={{ padding: "0.75rem" }}>
          <h6
            className="card-title mb-1"
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={post.title}
          >
            {post.title}
          </h6>

          <p
            className="card-text mb-2"
            style={{
              fontSize: "0.8rem",
              lineHeight: "1.1rem",
              flex: 1,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {post.content}
          </p>

          {post.fileUrl && (
            <div className="mb-2">
              {isAudio && (
                <audio
                  ref={audioRef}
                  controls
                  className="w-100"
                  style={{ height: "40px" }}
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
                  style={{ height: "120px", objectFit: "cover" }}
                  onPlay={handlePlay}
                >
                  <source src={post.fileUrl} type="video/mp4" />
                </video>
              )}
              {post.originalFilename && (
                <p className="text-muted small mt-1 mb-1" style={{ fontSize: "0.65rem" }}>
                  <strong>File:</strong> {post.originalFilename}
                </p>
              )}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-2">
            <div>
              <span className="badge bg-info text-white" style={{ fontSize: "0.72rem" }}>
                {post.category || "General"}
              </span>
              {post.featured && (
                <span className="badge bg-warning text-dark ms-2" style={{ fontSize: "0.72rem" }}>
                  Featured
                </span>
              )}
            </div>

            <div style={{ fontSize: "0.7rem", color: "#555" }} className="d-flex gap-2 align-items-center">
              <span className="d-flex align-items-center gap-1">
                <FaUser /> <small style={{ lineHeight: 1 }}>{post.author?.name || "Unknown"}</small>
              </span>
            </div>
          </div>

          <div className="mt-2 d-flex justify-content-between align-items-center" style={{ fontSize: "0.7rem", color: "#777" }}>
            <div />
            <div className="text-end">
              <FaCalendarAlt /> <small style={{ marginLeft: 6 }}>{formattedDate}</small>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}
