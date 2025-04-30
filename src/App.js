import React, { useEffect } from "react";
import './App.css';

// Import your image
import waterImage from './assets/water-landscape.jpg';  // Correct import path

function App() {
  useEffect(() => {
    const parallaxSections = document.querySelectorAll(".parallax-section");

    window.addEventListener("scroll", () => {
      const scrollPosition = window.pageYOffset;

      parallaxSections.forEach((section) => {
        const speed = 0.5;
        section.style.backgroundPosition = `center ${scrollPosition * speed}px`;
      });
    });
  }, []);

  return (
    <div className="App">
      {/* Parallax Section */}
      <section className="parallax-section" style={{ backgroundImage: `url(${waterImage})` }}>
        <div className="content">
          <h1>Water Forecasting Project</h1>
          <p>Predicting future water requirements using AI.</p>
        </div>
      </section>

      {/* Normal Section */}
      <section className="normal-section">
        <div className="content">
          <h2>Introduction to Water Forecasting</h2>
          <p>
            Water is one of the most critical resources, and its effective use is
            essential for sustainable growth. By forecasting future water demands,
            we can optimize its distribution and ensure an adequate supply for
            generations to come.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
