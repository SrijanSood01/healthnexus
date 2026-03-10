import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo_white.png";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    // check login status
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/auth");
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      
      {/* Left - Logo */}
      <div className="logo">
        <img src={logo} alt="HEAL Logo" className="logo-img" />
        <h2>Health Nexus</h2>
      </div>

      {/* Center - Nav Links */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/doctor">Doctor</Link></li>
        <li><Link to="/patient">Patient</Link></li>
        <li><Link to="/admin">Admin</Link></li>
        <li><Link to="/pharmacy">Pharmacy</Link></li>
        <li><Link to="/pathology">Pathology</Link></li>
      </ul>

      {/* Right - Auth Buttons */}
      <div className="auth-btn">
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/auth">
            <button>Login / Register</button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;