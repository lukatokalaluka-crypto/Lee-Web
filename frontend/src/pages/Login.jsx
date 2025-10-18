import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.jpg"; // branded background

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password }); // ✅ fixed route
      localStorage.setItem("token", data.token);
      alert("✅ Login successful!");
      navigate("/admin-dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("❌ Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Spacer to push content below fixed navbar */}
      <div style={{ height: "160px" }} />

      {/* Branded Background */}
      <div
        style={{
          backgroundImage: `url(${logo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(0,0,0,0.2)",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          <h3 className="text-center mb-4 fw-bold">🔐 Admin Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control form-control-lg"
              />
            </div>

            <div className="mb-3 position-relative">
              <label className="form-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control form-control-lg"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "15px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center text-muted small mt-3">
            &copy; {new Date().getFullYear()} Your SoundTrack Your Way Admin Panel
          </div>
        </div>
      </div>
    </>
  );
}
