import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo_white.png";

function Navbar() {

  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);


  const goToMyPage = () => {

    const role = localStorage.getItem("role");

    if (!role) {
      navigate("/auth");
      return;
    }

    const r = role.toLowerCase();

    if (r === "doctor") navigate("/doctor");
    else if (r === "patient") navigate("/patient");
    else if (r === "admin") navigate("/admin");
    else if (r === "pharmacy") navigate("/pharmacy");
    else if (r === "pathology") navigate("/pathology");
    else navigate("/");

  };


  const handleLogout = () => {

    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/auth");

  };


  const isMyPageActive =
    location.pathname === "/doctor" ||
    location.pathname === "/patient" ||
    location.pathname === "/admin" ||
    location.pathname === "/pharmacy" ||
    location.pathname === "/pathology";


  return (

    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>

      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="HEAL Logo" className="logo-img" />
        <h2>Health Nexus</h2>
      </div>


      {/* Navigation */}
      <ul className="nav-links">

        <li>
          <NavLink to="/" end>Home</NavLink>
        </li>

        <li>
          <a
            href="/mypage"
            onClick={(e) => {
              e.preventDefault();
              goToMyPage();
            }}
            className={isMyPageActive ? "active" : ""}
          >
            My Page
          </a>
        </li>

      </ul>


      {/* Auth */}
      <div className="auth-btn">

        {isLoggedIn ? (

          <button onClick={handleLogout}>
            Logout
          </button>

        ) : (

          <NavLink to="/auth">
            <button>Login</button>
          </NavLink>

        )}

      </div>

    </nav>

  );

}

export default Navbar;