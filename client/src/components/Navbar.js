import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo_white.png"; // 👈 your logo path

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      {/* Left - Logo */}
      <div className="logo">
        <img src={logo} alt="HEAL Logo" className="logo-img" />
        <h2>H.E.A.L</h2>
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

      {/* Right - Auth Button */}
      <div className="auth-btn">
        <Link to="/auth">
          <button>Login / Register</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
