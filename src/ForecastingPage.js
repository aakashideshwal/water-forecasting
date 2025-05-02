import React from "react";
import './ForecastingPage.css';

function ForecastingPage() {
  return (
    <div className="forecasting-page">
      {/* Intro Section */}
      <section className="intro-section">
        <h2>Water Demand Forecasting</h2>
        <p>
          Discover how AI and machine learning can help us predict future water needs, ensuring sustainability and optimal resource management.
        </p>
      </section>

      {/* Data Input Section */}
      <section className="data-input-section">
        <h2>Upload Your Data</h2>
        <p>
          Begin forecasting by uploading your historical water usage data. Our model will analyze and provide a forecast for future water demands.
        </p>
        <button className="upload-btn">Upload Data</button>
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
          Dive deeper into how our forecasting model works and how you can use it for better planning and management of water resources.
        </p>
        <button className="learn-more-btn">Read the Docs</button>
      </section>

      {/* Forecast Results Section */}
      <section className="forecast-results-section">
        <h2>Your Water Forecast</h2>
        <p>View forecasted water usage once your data is uploaded. Stay ahead with accurate predictions for your region.</p>
        <button className="forecast-btn">View Forecast</button>
      </section>
    </div>
  );
}

export default ForecastingPage;
