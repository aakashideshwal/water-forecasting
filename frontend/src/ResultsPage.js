import { useAuth } from "./AuthContext";
import React, { useEffect, useState } from "react";
import "./ResultsPage.css";
import "./ForecastingPage.css"; // Re-use styles from ForecastingPage
import Footer from "./Footer";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ResultPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/result", {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch results. Please generate a forecast first.");
        }
        return res.json();
      })
      .then((data) => {
        if (data.detail) { // Handle backend error messages
          throw new Error(data.detail);
        }
        setData(data);
      })
      .catch((err) => {
        console.error("Error fetching results:", err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div className="result-page"><p className="error-message">Error: {error}</p></div>;
  }

  if (!data) {
    return <div className="result-page"><p>Loading results...</p></div>;
  }

  // Combine historical and forecast data for the chart
  const chartData = data.historical_data.map(item => ({
    date: item.date,
    usage: item.usage,
    predicted_usage: null, // No prediction for historical data
  }));

  data.forecast.forEach(item => {
    chartData.push({
      date: item.date,
      usage: null, // No historical usage for forecast dates
      predicted_usage: item.predicted_usage,
    });
  });

  // Summary calculations from the forecast data
  const forecastValues = data.forecast.map(item => item.predicted_usage);
  const avgUsage = forecastValues.reduce((a, b) => a + b, 0) / forecastValues.length;
  const peakUsage = Math.max(...forecastValues);
  const totalUsage = forecastValues.reduce((a, b) => a + b, 0);

  return (
    <div className="result-page">
      <section className="intro-section">
        <h2>Your Forecast Results</h2>
        <p>A comparison of your historical water usage against the AI-powered forecast.</p>
      </section>

      {/* Chart Section */}
      <div className="chart-placeholder">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="usage" 
              name="Historical Usage"
              stroke="#8884d8" 
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="predicted_usage" 
              name="Forecasted Usage"
              stroke="#82ca9d" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast Summary */}
      <div className="forecast-summary">
        <h2>Forecast Summary</h2>
        <ul>
          <li>Average Daily Forecast: {avgUsage.toFixed(2)} liters</li>
          <li>Predicted Peak Demand: {peakUsage.toFixed(2)} liters</li>
          <li>Estimated Total Forecast Usage: {totalUsage.toFixed(2)} liters</li>
        </ul>
      </div>

      <button className="back-btn" onClick={() => window.history.back()}>
        ← Go Back
      </button>

      <Footer />
    </div>
  );
}

export default ResultPage;
