import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const API_BASE_URL = "http://localhost:5000/api";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const redirectByRole = (role) => {
    const routes = {
      admin: "/admin",
      doctor: "/doctor",
      patient: "/patient",
      pharmacy: "/pharmacy",
      pathology: "/pathology",
    };

    navigate(routes[role.toLowerCase()] || "/");
  };

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role) {
      const routes = {
        admin: "/admin",
        doctor: "/doctor",
        patient: "/patient",
        pharmacy: "/pharmacy",
        pathology: "/pathology",
      };

      navigate(routes[role.toLowerCase()] || "/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      if (isLogin) {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        const { token, user } = response.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("name", user.name);
        localStorage.setItem("userId", user.id);

        redirectByRole(user.role);
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "patient",
      });

      alert(response.data.message);
      setIsLogin(true);
      setFormData({
        name: "",
        email: formData.email,
        password: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <div className={`auth-card ${isLogin ? "login-mode" : "register-mode"}`}>
        <div className="form-section">
          <div className="form-container">
            <h2>{isLogin ? "Login to Health Nexus" : "Register for Health Nexus"}</h2>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </>
              )}

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
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <span
                  className="toggle-password"
                  onClick={() => setShowPassword((currentValue) => !currentValue)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      setShowPassword((currentValue) => !currentValue);
                    }
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>

              <button type="submit">{isLogin ? "Login" : "Register"}</button>
            </form>
          </div>
        </div>

        <div className="info-section">
          <div className="info-content">
            {isLogin ? (
              <>
                <h2>New to Health Nexus?</h2>
                <p>Join our unified hospital management ecosystem today.</p>
                <button onClick={() => setIsLogin(false)}>Register Now</button>
              </>
            ) : (
              <>
                <h2>Already have an account?</h2>
                <p>Login to continue your journey with Health Nexus.</p>
                <button onClick={() => setIsLogin(true)}>Login</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
