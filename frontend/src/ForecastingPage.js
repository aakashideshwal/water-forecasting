import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from './AuthContext';
import './ForecastingPage.css';
import './SignupPage.css'; 
import Footer from "./Footer";
import PageHeader from "./PageHeader"; // Import PageHeader

function ForecastingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [latitude, setLatitude] = useState('28.61'); // Default to New Delhi
  const [longitude, setLongitude] = useState('77.23'); // Default to New Delhi
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const handleGenerateForecast = async () => {
    setIsLoading(true);
    setMessage("Generating forecast... this may take a moment.");

    const formData = new FormData();
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("future_steps", "7");

    console.log("Token being sent with request:", auth.token);
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
      <PageHeader 
        title="Water Demand Forecasting"
        subtitle="Upload your historical data and generate AI-powered usage predictions."
      >
        <button onClick={handleLogout} style={{
          background: 'linear-gradient(45deg, #00bcd4, #0288d1)',
          color: 'white',
          padding: '12px 28px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold',
          textDecoration: 'none',
          display: 'inline-block',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(2, 136, 209, 0.2)',
          transform: 'translateY(0)',
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 2
        }}>Logout</button>
      </PageHeader>

      {/* Data Input Section */}
      <section className="data-input-section">
        <h2>Upload Your Data</h2>
        <p>
          Begin forecasting by uploading your historical water usage data.
          Our model will analyze and provide a forecast for future water demands.
        </p>
        <Link to="/upload">
          <button className="btn-primary">Upload Data</button>
        </Link>
      </section>

      {/* Forecast Generation Section */}
      <section className="forecast-results-section">
        <h2>Generate Your Water Forecast</h2>
        <p>
          After uploading your data, enter a location and generate a forecast.
        </p>
        
        <div className="location-inputs">
          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input 
              type="text" 
              id="latitude" 
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input 
              type="text" 
              id="longitude" 
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </div>

        <div className="forecast-actions">
          <button 
            className="btn-primary" 
            onClick={handleGenerateForecast} 
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Forecast"}
          </button>
        </div>
        {message && <p style={{marginTop: '20px'}}>{message}</p>}
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

      <Footer/>
    </div>
  );
}

export default ForecastingPage;
