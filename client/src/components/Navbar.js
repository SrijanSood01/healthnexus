import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo_white.png";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("token")));
    setMenuOpen(false);
  }, [location.pathname]);

  const goToMyPage = () => {
    const role = localStorage.getItem("role");

    if (!role) {
      navigate("/auth");
      return;
    }

    const routes = {
      doctor: "/doctor",
      patient: "/patient",
      admin: "/admin",
      pharmacy: "/pharmacy",
      pathology: "/pathology",
    };

    navigate(routes[role.toLowerCase()] || "/");
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/auth");
  };

  const isMyPageActive = ["/doctor", "/patient", "/admin", "/pharmacy", "/pathology"].includes(
    location.pathname,
  );

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-left">
        <div className="logo">
          <img src={logo} alt="HEAL Logo" className="logo-img" />
          <div className="logo-copy">
            <h2>HEAL</h2>
            <span>Hospital Ecosystem</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="nav-toggle"
        onClick={() => setMenuOpen((currentValue) => !currentValue)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? "X" : "Menu"}
      </button>

      <ul className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>
        <li>
          <button type="button" onClick={goToMyPage} className={isMyPageActive ? "active" : ""}>
            My Page
          </button>
        </li>
      </ul>

      <div className="auth-btn">
        {isLoggedIn ? (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <NavLink to="/auth">
            <button type="button">Login</button>
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
