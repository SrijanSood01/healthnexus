import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData, role: "patient" }; // Only patient self-registration

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          setMessage("✅ Login successful!");
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // ✅ Role-based redirects matching App.js
          const role = data.user.role?.toLowerCase();

          switch (role) {
            case "admin":
              navigate("/admin");
              break;
            case "doctor":
              navigate("/doctor");
              break;
            case "pharmacy":
            case "pharmacy staff":
              navigate("/pharmacy");
              break;
            case "pathology":
            case "pathology staff":
              navigate("/pathology");
              break;
            default:
              navigate("/patient");
              break;
          }
        } else {
          setMessage("✅ Patient registered successfully!");
          setTimeout(() => setIsLogin(true), 1200); // Go back to login after success
        }
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Server error:", err);
      setMessage("❌ Server error, please try again later.");
    }
  };

  return (
    <div className="auth-page">
      <div className={`auth-card ${isLogin ? "login-mode" : "register-mode"}`}>
        {/* Form Section */}
        <div className="form-section">
          {isLogin ? (
            <div className="form-container">
              <h2>Login to H.E.A.L</h2>
              <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="submit">Login</button>
              </form>
              {message && <p className="status-msg">{message}</p>}
            </div>
          ) : (
            <div className="form-container">
              <h2>Register for H.E.A.L</h2>
              <form onSubmit={handleSubmit}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <p className="note">
                  Only patients can register. Staff accounts must be created by
                  the Admin.
                </p>
                <button type="submit">Register</button>
              </form>
              {message && <p className="status-msg">{message}</p>}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="info-section">
          {isLogin ? (
            <div className="info-content">
              <h2>New to H.E.A.L?</h2>
              <p>Join our unified hospital management ecosystem today.</p>
              <button onClick={() => setIsLogin(false)}>Register Now</button>
            </div>
          ) : (
            <div className="info-content">
              <h2>Already have an account?</h2>
              <p>Login to continue your journey with H.E.A.L.</p>
              <button onClick={() => setIsLogin(true)}>Login</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
