import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth() {

  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Auto redirect if already logged in
  useEffect(() => {

    const role = localStorage.getItem("role");

    if (role) {
      redirectByRole(role);
    }

  }, []);


  // Redirect based on role
  const redirectByRole = (role) => {

    const routes = {
      admin: "/admin",
      doctor: "/doctor",
      patient: "/patient",
      pharmacy: "/pharmacy",
      pathology: "/pathology"
    };

    const r = role.toLowerCase();

    navigate(routes[r] || "/");

  };


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (isLogin) {

        // LOGIN
        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        // Save auth data
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("name", res.data.user.name);

        // Redirect user
        redirectByRole(res.data.user.role);

      } else {

        // REGISTER (Patient only)
        const res = await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: "patient"
          }
        );

        alert(res.data.message);
        setIsLogin(true);

      }

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  };


  return (

    <div className="auth-page">

      <div className={`auth-card ${isLogin ? "login-mode" : "register-mode"}`}>

        {/* FORM SECTION */}
        <div className="form-section">

          <div className="form-container">

            <h2>
              {isLogin
                ? "Login to Health Nexus"
                : "Register for Health Nexus"}
            </h2>

            <form onSubmit={handleSubmit}>

              {!isLogin && (
                <>
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
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
                onChange={handleChange}
                required
              />

              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />

              <button type="submit">
                {isLogin ? "Login" : "Register"}
              </button>

            </form>

          </div>

        </div>


        {/* INFO SECTION */}
        <div className="info-section">

          <div className="info-content">

            {isLogin ? (

              <>
                <h2>New to Health Nexus?</h2>

                <p>
                  Join our unified hospital management ecosystem today.
                </p>

                <button onClick={() => setIsLogin(false)}>
                  Register Now
                </button>
              </>

            ) : (

              <>
                <h2>Already have an account?</h2>

                <p>
                  Login to continue your journey with Health Nexus.
                </p>

                <button onClick={() => setIsLogin(true)}>
                  Login
                </button>
              </>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}

export default Auth;