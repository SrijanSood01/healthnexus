import React from 'react';

function Home() {
  return (
    <div className="home">
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Welcome to Health Nexus Hospital</h1>
          <p>Your health, our priority. Experience smarter, faster, and compassionate healthcare.</p>
          <button className="cta-btn">Book Appointment</button>
        </div>
        <div className="hero-image">
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="service-cards">
          <div className="card">
            <h3>Doctor Consultation</h3>
            <p>Connect with our experienced doctors for personalized care.</p>
          </div>
          <div className="card">
            <h3>Pharmacy</h3>
            <p>Order medicines online with quick and reliable delivery.</p>
          </div>
          <div className="card">
            <h3>Diagnostics</h3>
            <p>Book lab tests and access your reports anytime, anywhere.</p>
          </div>
          <div className="card">
            <h3>Emergency Care</h3>
            <p>24/7 emergency support for immediate medical needs.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About Us</h2>
        <p>
          Health Nexus is a modern digital hospital committed to delivering
          efficient, transparent, and patient-friendly healthcare. With AI-driven
          insights, seamless coordination, and cloud-powered systems, we ensure
          your health journey is smooth and stress-free.
        </p>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <h2>Get in Touch</h2>
        <p>📍 Chandigarh, India</p>
        <p>📞 +91 98765 43210</p>
        <p>✉️ contact@healhospital.com</p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Health Nexus Hospital | All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default Home;
