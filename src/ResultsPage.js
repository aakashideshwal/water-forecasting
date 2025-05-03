import React from "react";
import { Link } from "react-router-dom";
import './ResultsPage.css';
import { Line } from 'react-chartjs-2'; // Assuming you want to use Chart.js for displaying the forecast

function ResultsPage() {
  // Sample data for chart (you'll replace this with the actual forecast data)
  const forecastData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Time periods
    datasets: [
      {
        label: 'Forecasted Water Usage',
        data: [100, 120, 130, 110], // Forecast data values (replace with actual data)
        borderColor: '#00bcd4',
        backgroundColor: 'rgba(0, 188, 212, 0.2)',
        borderWidth: 2,
        fill: true
      }
    ]
  };

  return (
    <div className="results-page">
      {/* Header Section */}
      <section className="header-section">
        <h2>Your Water Forecast Results</h2>
        <p>Here are the results based on your uploaded data. Review the predicted water demand for the upcoming weeks.</p>
      </section>

      {/* Forecast Chart */}
      <section className="forecast-chart">
        <h3>Water Demand Forecast</h3>
        <div className="chart-container">
          <Line data={forecastData} options={{ responsive: true }} />
        </div>
      </section>

      {/* Summary Section */}
      <section className="summary-section">
        <h3>Summary of the Forecast</h3>
        <p>The forecast indicates a stable water demand with a slight increase over the next 4 weeks. This data can help in planning water resources more effectively.</p>
      </section>

      {/* Navigation Buttons */}
      <section className="navigation-buttons">
        <Link to="/forecast">
          <button className="back-to-forecast-btn">Back to Forecasting</button>
        </Link>
        <button className="download-results-btn">Download Results</button>
      </section>
    </div>
  );
}

export default ResultsPage;
