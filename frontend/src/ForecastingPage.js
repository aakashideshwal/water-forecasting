import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from './AuthContext';
import './ForecastingPage.css';
import Footer from "./Footer";

function ForecastingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleGenerateForecast = async () => {
    setIsLoading(true);
    setMessage("Generating forecast... this may take a moment.");

    const formData = new FormData();
    formData.append("latitude", "28.61");
    formData.append("longitude", "77.23");
    formData.append("future_steps", "7");

    try {
      const response = await fetch("http://127.0.0.1:8000/forecast", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to generate forecast.");
      }

      setMessage("Forecast generated successfully! Redirecting to results...");
      
      setTimeout(() => {
        navigate("/result");
      }, 2000);

    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forecasting-page">
      {/* Intro Section */}
      <section className="intro-section">
        <h2>Water Demand Forecasting</h2>
        <p>
          Discover how AI and machine learning can help us predict future water needs,
          ensuring sustainability and optimal resource management.
        </p>
      </section>

      {/* Data Input Section */}
      <section className="data-input-section">
        <h2>Upload Your Data</h2>
        <p>
          Begin forecasting by uploading your historical water usage data.
          Our model will analyze and provide a forecast for future water demands.
        </p>
        {/*  Button Linked to Upload Page */}
        <Link to="/upload">
          <button className="upload-btn">Upload Data</button>
        </Link>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <h2>Why Water Forecasting Matters</h2>
        <div className="benefits-cards">
          <div className="benefit-card">
            <h3>Efficient Resource Management</h3>
            <p>Helps in managing water resources effectively, avoiding wastage, and ensuring sustainable use.</p>
          </div>
          <div className="benefit-card">
            <h3>Climate Resilience</h3>
            <p>Prepares for seasonal changes and extreme weather patterns, reducing the risk of droughts and floods.</p>
          </div>
          <div className="benefit-card">
            <h3>Informed Decision Making</h3>
            <p>Equips policymakers with data to make informed decisions for long-term water management and urban planning.</p>
          </div>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="learn-more-section">
        <h2>Want to Learn More?</h2>
        <p>
          Dive deeper into how our forecasting model works and how you can use it
          for better planning and management of water resources.
        </p>
        <Link to="/documentation">
          <button className="learn-more-btn">Read the Docs</button>
        </Link>
      </section>

      {/* Forecast Results Section */}
      <section className="forecast-results-section">
        <h2>Your Water Forecast</h2>
        <p>
          After uploading your data, generate a forecast. 
          Then, view the results to stay ahead with accurate predictions.
        </p>
        <div className="forecast-actions">
          <button 
            className="forecast-btn" 
            onClick={handleGenerateForecast} 
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Forecast"}
          </button>
        </div>
        {message && <p style={{marginTop: '20px'}}>{message}</p>}
      </section>
      <Footer/>
    </div>
  );
}

export default ForecastingPage;
