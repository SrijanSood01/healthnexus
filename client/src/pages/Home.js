import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <h1>Care operations, connected across every department.</h1>
          <p>
            HEAL brings patient care, doctor workflows, pharmacy operations, and pathology
            updates into one calm and reliable hospital workspace.
          </p>
          <button type="button" className="cta-btn" onClick={() => navigate("/auth")}>
            Open HEAL Portal
          </button>
        </div>
      </section>

      <section className="services">
        <h2>Core Workflows</h2>
        <div className="service-cards">
          <div className="card">
            <h3>Patient Care</h3>
            <p>Book appointments, review prescriptions, and keep reports easy to access.</p>
          </div>
          <div className="card">
            <h3>Doctor Desk</h3>
            <p>Manage visits, view assigned patients, and issue prescriptions with less friction.</p>
          </div>
          <div className="card">
            <h3>Pharmacy</h3>
            <p>Track medicine inventory, stock levels, and essential catalog updates in one place.</p>
          </div>
          <div className="card">
            <h3>Pathology</h3>
            <p>Create and publish reports quickly while keeping clinical visibility consistent.</p>
          </div>
        </div>
      </section>

      <section className="about">
        <h2>About HEAL</h2>
        <p>
          HEAL is designed for hospitals that want a clean, structured digital layer over daily
          operations. The experience stays minimal, while the workflows remain practical for
          patients, doctors, pharmacy teams, and pathology staff.
        </p>
      </section>

      <section className="contact">
        <h2>Contact</h2>
        <p>Chandigarh, India</p>
        <p>+91 98765 43210</p>
        <p>contact@healhospital.com</p>
      </section>

      <footer className="footer">
        <p>© 2026 HEAL Hospital Ecosystem. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
