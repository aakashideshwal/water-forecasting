import React from "react";
import "./ResultsPage.css";
import Footer from "./Footer";

function ResultPage() {
  return (
    <div className="result-page">
      <h1>Forecast Results</h1>
      <p>Here's your predicted water usage based on the data you uploaded.</p>

      {/* Placeholder for chart */}
      <div className="chart-placeholder">
        <p>[Graph of water forecast will appear here]</p>
      </div>

      {/* Forecast Summary */}
      <div className="forecast-summary">
        <h2>Forecast Summary</h2>
        <ul>
          <li>Average Daily Usage: 123,000 liters</li>
          <li>Predicted Peak Demand: 145,000 liters on July 18</li>
          <li>Estimated Annual Usage: 45 million liters</li>
        </ul>
      </div>

      <button className="back-btn" onClick={() => window.history.back()}>← Go Back</button>
      
      <Footer/>
    </div>
  );
}

export default ResultPage;
