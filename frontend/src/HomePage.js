import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import waterImage from "./assets/water-landscape.jpg";

function HomePage() {
  useEffect(() => {
    const parallaxSections = document.querySelectorAll(".parallax");

    window.addEventListener("scroll", () => {
      const scrollPosition = window.pageYOffset;
      parallaxSections.forEach((section) => {
        const speed = 0.4;
        section.style.backgroundPosition = `center ${scrollPosition * speed}px`;
      });
    });
  }, []);

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">WaterAI</div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#why">Why Forecasting?</a></li>
        </ul>
      </nav>

      {/* Hero Parallax Section */}
      <section className="parallax" style={{ backgroundImage: `url(${waterImage})` }}>
        <div className="hero-text">
          <h1>Water Forecasting</h1>
          <p>Harnessing AI to predict and protect future water needs</p>
          <Link to="/signup" className="hero-btn">Start Forecasting</Link>
        </div>
      </section>

      {/* About Section */}
      <section className="content-section" id="about">
        <h2>About This Project</h2>
        <p>
          This AI-driven platform forecasts future water demand by analyzing past
          usage, seasonal data, and rainfall statistics. With this tool, policymakers
          and communities can plan ahead and make sustainable choices.
        </p>
      </section>

      {/* Why Forecasting */}
      <section className="content-section alt-bg" id="why">
        <h2>Why Water Forecasting Matters</h2>
        <p>
          As populations grow and climates change, water resource management becomes
          increasingly vital. Forecasting helps avoid droughts, floods, and wastage.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Water Forecasting AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
