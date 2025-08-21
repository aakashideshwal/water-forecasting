import React, { useEffect, useState } from "react";
import "./ResultsPage.css";
import Footer from "./Footer";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function ResultPage() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/result")
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.error("Error fetching results:", err));
  }, []);

  if (!results) {
    return <p>Loading results...</p>;
  }

  if (results.error) {
    return <p>{results.error}</p>;
  }

  // Prepare data for chart
  const chartData = results.predictions.map((val, idx) => ({
    step: `Step ${idx + 1}`,
    usage: val
  }));

  // Summary calculations
  const avgUsage =
    results.predictions.reduce((a, b) => a + b, 0) / results.predictions.length;
  const peakUsage = Math.max(...results.predictions);
  const totalUsage = results.predictions.reduce((a, b) => a + b, 0);

  return (
    <div className="result-page">
      <h1>Forecast Results</h1>
      <p>Here's your predicted water usage based on the data you uploaded.</p>

      {/* Chart Section */}
      <div className="chart-placeholder">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="usage" stroke="#007bff" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="step" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast Summary */}
      <div className="forecast-summary">
        <h2>Forecast Summary</h2>
        <ul>
          <li>Average Daily Usage: {avgUsage.toFixed(2)} liters</li>
          <li>Predicted Peak Demand: {peakUsage.toFixed(2)} liters</li>
          <li>Estimated Total Usage: {totalUsage.toFixed(2)} liters</li>
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
