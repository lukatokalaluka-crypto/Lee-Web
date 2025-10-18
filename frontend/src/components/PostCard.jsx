import React, { useState } from "react";
import { FaUser, FaCalendarAlt, FaDownload } from "react-icons/fa";

export default function PostCard({ post }) {
  const [showModal, setShowModal] = useState(false);
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

  return (
    <>
      {/* Card */}
      <div
        className="card shadow-sm"
        style={{
          width: "260px",
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          marginBottom: "15px",
          height: "420px",
          cursor: "pointer",
        }}
        onClick={() => setShowModal(true)}
        role="button"
        aria-label={`Open post ${post.title}`}
      >
        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            style={{
              width: "100%",
              height: "140px",
              objectFit: "cover",
            }}
          />
        )}

        <div className="card-body d-flex flex-column" style={{ padding: "0.75rem" }}>
          <h6
            className="card-title mb-1"
            style={{
              fontSize: "1rem",
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
              fontSize: "0.85rem",
              lineHeight: "1.1rem",
              flex: 1,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {post.content}
          </p>

          <div className="d-flex justify-content-between align-items-center mt-2">
            <div>
              <span className="badge bg-info" style={{ fontSize: "0.72rem" }}>
                {post.category || "General"}
              </span>
              {post.featured && (
                <span className="badge bg-warning text-dark ms-2" style={{ fontSize: "0.72rem" }}>
                  Featured
                </span>
              )}
            </div>

            <div style={{ fontSize: "0.75rem", color: "#555" }} className="d-flex gap-2 align-items-center">
              <span className="d-flex align-items-center gap-1">
                <FaUser /> <small style={{ lineHeight: 1 }}>{post.author?.name || "Unknown"}</small>
              </span>
            </div>
          </div>

          <div className="mt-2 d-flex justify-content-between align-items-center" style={{ fontSize: "0.75rem", color: "#777" }}>
            <div />
            <div className="text-end">
              <FaCalendarAlt /> <small style={{ marginLeft: 6 }}>{formattedDate}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg">
              <div className="modal-header border-0">
                <div className="d-flex align-items-center" style={{ gap: 12 }}>
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={`${post.title} thumbnail`}
                      style={{
                        width: 84,
                        height: 64,
                        objectFit: "cover",
                        borderRadius: 8,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                      }}
                    />
                  )}
                  <div className="d-flex flex-column">
                    <h5 className="modal-title mb-0" style={{ fontWeight: 700 }}>
                      {post.title}
                    </h5>
                    <small className="text-muted" style={{ fontSize: "0.85rem" }}>
                      <FaUser className="me-1" /> {post.author?.name || "Unknown"} &nbsp; • &nbsp;
                      <FaCalendarAlt className="me-1" /> {formattedDate}
                    </small>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                  style={{ marginLeft: "auto" }}
                >
                  Close
                </button>
              </div>

              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="container-fluid">
                  <div className="row gx-4">
                    <div className="col-12 col-md-4">
                      {post.featuredImage && (
                        <div className="mb-3">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="img-fluid rounded"
                            style={{ width: "100%", height: 180, objectFit: "cover" }}
                          />
                        </div>
                      )}

                      <div className="mb-3">
                        <div className="small text-muted">Category</div>
                        <div className="fw-semibold">{post.category || "General"}</div>
                      </div>

                      <div className="mb-3">
                        <div className="small text-muted">Tags</div>
                        <div>
                          {post.tags?.length ? (
                            post.tags.map((t, i) => (
                              <span key={i} className="badge bg-secondary me-1">
                                {t}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted small">No tags</span>
                          )}
                        </div>
                      </div>

                      {post.fileUrl && (
                        <div className="mb-2">
                          {isAudio && (
                            <audio controls className="w-100">
                              <source src={post.fileUrl} type="audio/mpeg" />
                            </audio>
                          )}
                          {isVideo && (
                            <video controls className="w-100" style={{ maxHeight: 220 }}>
                              <source src={post.fileUrl} type="video/mp4" />
                            </video>
                          )}
                        </div>
                      )}

                      {post.fileUrl && (
                        <a
                          href={post.fileUrl}
                          download
                          className="btn btn-outline-primary btn-sm w-100 mt-2 d-flex justify-content-center align-items-center"
                        >
                          <FaDownload className="me-2" /> Download
                        </a>
                      )}
                    </div>

                    <div className="col-12 col-md-8">
                      <div style={{ lineHeight: 1.6, fontSize: "0.97rem", color: "#222" }}>
                        {/* Content can be long — keep typography readable and spaced */}
                        <p style={{ marginBottom: 12 }}>{post.content}</p>

                        {/* Optional structured metadata or description */}
                        {post.description && (
                          <div className="mb-3">
                            <h6 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Overview</h6>
                            <p className="text-muted" style={{ marginBottom: 0 }}>
                              {post.description}
                            </p>
                          </div>
                        )}

                        {/* Any extra details: credits, production, links */}
                        {post.details && (
                          <div className="mb-3">
                            <h6 style={{ fontSize: "0.95rem", fontWeight: 700 }}>Details</h6>
                            <div className="text-muted" style={{ whiteSpace: "pre-wrap" }}>
                              {post.details}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
