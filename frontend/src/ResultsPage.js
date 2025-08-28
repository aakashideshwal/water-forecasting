import { useAuth } from "./AuthContext";
import React, { useEffect, useState } from "react";
import "./ResultsPage.css";
import "./ForecastingPage.css"; // Re-use styles from ForecastingPage
import Footer from "./Footer";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Helper component for the risk cards
const RiskCard = ({ title, value, description, riskLevel }) => {
  const riskClass = `risk-card ${riskLevel}`;
  return (
    <div className={riskClass}>
      <h3>{title}</h3>
      <p className="value">{value}</p>
      <p>{description}</p>
    </div>
  );
};

function ResultPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    if (auth.token) {
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
          if (data.detail) {
            throw new Error(data.detail);
          }
          setData(data);
        })
        .catch((err) => {
          console.error("Error fetching results:", err);
          setError(err.message);
        });
    }
  }, [auth.token]);

  if (error) {
    return <div className="result-page"><p className="error-message">Error: {error}</p></div>;
  }

  if (!data) {
    return <div className="result-page"><p>Loading results...</p></div>;
  }

  // --- Process Data for Charts and Cards ---
  const usageForecast = data.usage_forecast;
  const floodForecast = data.flood_forecast.daily;

  // 1. Main Usage Chart Data
  const usageChartData = usageForecast.historical_data.map(item => ({
    date: item.date,
    usage: item.usage,
  }));
  usageForecast.forecast.forEach(item => {
    usageChartData.push({
      date: item.date,
      predicted_usage: item.predicted_usage,
    });
  });

  // 2. Flood Chart Data
  const floodChartData = floodForecast.time.map((t, i) => ({
      date: t,
      discharge: floodForecast.river_discharge[i],
  }));

  // 3. Precipitation Chart Data
  const precipChartData = usageForecast.forecast.map(item => ({
      date: item.date,
      precipitation: item.precipitation,
  }));

  // 4. Summary & Risk Calculations
  const forecastValues = usageForecast.forecast.map(item => item.predicted_usage);
  const avgUsage = forecastValues.reduce((a, b) => a + b, 0) / forecastValues.length;
  const peakUsage = Math.max(...forecastValues);
  const totalUsage = forecastValues.reduce((a, b) => a + b, 0);

  const peakDischarge = Math.max(...floodForecast.river_discharge);
  let floodRisk = { level: 'low-risk', text: 'Low risk of flooding detected.' };
  if (peakDischarge > 4000) {
      floodRisk = { level: 'high-risk', text: 'High flood risk detected. River discharge is significantly above normal.' };
  } else if (peakDischarge > 2000) {
      floodRisk = { level: 'warning', text: 'Moderate flood risk. Monitor local alerts.' };
  }

  const totalPrecipitation = usageForecast.forecast.reduce((sum, item) => sum + item.precipitation, 0);
  let droughtRisk = { level: 'low-risk', text: 'Sufficient rainfall predicted.' };
  if (totalPrecipitation < 1.0) {
      droughtRisk = { level: 'warning', text: 'Potential drought conditions. Very low rainfall predicted.' };
  }

  return (
    <div className="result-page">
      <section className="intro-section">
        <h2>Your Forecast Results</h2>
        <p>A complete analysis of your water usage forecast and hydro-climatic risks.</p>
      </section>

      {/* Main Chart Section */}
      <div className="chart-placeholder">
        <h3>Water Usage Forecast (Historical vs. Predicted)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={usageChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="usage" name="Historical Usage" stroke="#8884d8" strokeWidth={2} dot={false}/>
            <Line type="monotone" dataKey="predicted_usage" name="Forecasted Usage" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Charts Section */}
      <section className="risk-assessment-section">
        <h2>Detailed Forecast Charts</h2>
        <div className="risk-cards-container">
            <div className="chart-placeholder" style={{flex: 1, minWidth: '400px'}}>
                <h3>River Discharge Forecast (Flood Risk)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={floodChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis label={{ value: 'm³/s', angle: -90, position: 'insideLeft' }}/>
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="discharge" name="River Discharge" stroke="#007bff" strokeWidth={2} dot={false}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="chart-placeholder" style={{flex: 1, minWidth: '400px'}}>
                <h3>Daily Precipitation Forecast (Drought Risk)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={precipChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis label={{ value: 'mm', angle: -90, position: 'insideLeft' }}/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="precipitation" name="Precipitation" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </section>

      {/* Risk Assessment Section */}
      <section className="risk-assessment-section">
        <h2>Hydro-Climatic Risk Assessment</h2>
        <div className="risk-cards-container">
            <RiskCard 
                title="Flood Risk"
                value={`${peakDischarge.toFixed(2)} m³/s`}
                description={floodRisk.text}
                riskLevel={floodRisk.level}
            />
            <RiskCard 
                title="Drought Risk"
                value={`${totalPrecipitation.toFixed(2)} mm`}
                description={droughtRisk.text}
                riskLevel={droughtRisk.level}
            />
        </div>
      </section>

      {/* Forecast Summary */}
      <div className="forecast-summary">
        <h2>Usage Forecast Summary</h2>
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
