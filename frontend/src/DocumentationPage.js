import React from "react";
import './DocumentationPage.css';
import Footer from "./Footer";

function DocumentationPage() {
  return (
    <div className="documentation-page">
      <header className="documentation-header">
        <h1>Water Forecasting Documentation</h1>
        <p>Explore how our AI-driven Water Forecasting platform works and learn how to effectively manage water resources with accurate predictions.</p>
      </header>

      {/* Introduction Section */}
      <section className="content-section intro-section">
        <h2>Introduction</h2>
        <p>
          Water forecasting plays a crucial role in managing water resources, especially in areas affected by changing climate conditions and growing populations. With the help of advanced AI techniques, our platform forecasts future water demand, allowing for informed decision-making in water resource planning.
        </p>
        <p>
          This documentation is designed to guide you through the features of the platform, how the model works, data requirements, and how you can get started using the system to predict water demand for your region.
        </p>
      </section>

      {/* How the Forecasting Model Works */}
      <section className="content-section model-section">
        <h2>How the Forecasting Model Works</h2>
        <p>
          Our AI model leverages machine learning algorithms to predict water demand based on historical usage data, weather conditions, and other environmental factors. Here's an in-depth look at how the forecasting process works:
        </p>
        <ul>
          <li><strong>Step 1: Data Collection:</strong> The model collects historical water usage data, weather patterns (temperature, rainfall), and other variables like population growth and economic activity that can affect water consumption.</li>
          <li><strong>Step 2: Data Cleaning & Preprocessing:</strong> To ensure accurate predictions, the data is preprocessed to handle missing values, outliers, and normalize different scales of measurements.</li>
          <li><strong>Step 3: Model Training:</strong> The data is used to train machine learning algorithms such as time-series forecasting models and neural networks, allowing the system to understand patterns and trends in water usage.</li>
          <li><strong>Step 4: Prediction:</strong> Once trained, the model uses the latest data to forecast future water consumption, offering predictions for different timeframes (daily, monthly, yearly).</li>
        </ul>
        <p>
          By utilizing both historical data and real-time environmental factors, the model can provide highly accurate predictions for various locations and conditions.
        </p>
      </section>

      {/* Data Requirements */}
      <section className="content-section data-section">
        <h2>Data Requirements</h2>
        <p>
          To generate accurate forecasts, the platform requires historical data on water usage and relevant environmental information. Here's what you need to provide:
        </p>
        <ul>
          <li><strong>Date:</strong> The specific date or time period of each water usage record (e.g., daily, weekly, or monthly data).</li>
          <li><strong>Water Usage:</strong> The volume of water consumed (e.g., in liters or gallons).</li>
          <li><strong>Location:</strong> The region or location where the water was used. This helps tailor the forecasts for specific geographic conditions.</li>
          <li><strong>Weather Data (Optional but Recommended):</strong> Including temperature, rainfall, humidity, and other weather data can improve the accuracy of predictions, especially in regions with highly variable weather conditions.</li>
        </ul>
        <p>
          You can upload the data in CSV format. The more granular and detailed the data, the more accurate the predictions will be.
        </p>
      </section>

      {/* Features of the Water Forecasting Platform */}
      <section className="content-section features-section">
        <h2>Key Features of the Water Forecasting Platform</h2>
        <p>Our platform offers several powerful features that help you predict water demand and plan accordingly:</p>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Accurate Forecasts</h3>
            <p>Our machine learning model generates precise forecasts based on historical data, weather, and regional factors.</p>
          </div>
          <div className="feature-card">
            <h3>Customizable Forecast Period</h3>
            <p>Select the time period for your forecast, whether it's for the next month, year, or even a multi-year outlook.</p>
          </div>
          <div className="feature-card">
            <h3>Real-time Data Integration</h3>
            <p>Integrate real-time data feeds to dynamically adjust forecasts as new information becomes available.</p>
          </div>
          <div className="feature-card">
            <h3>Interactive Visualizations</h3>
            <p>View your forecasted water usage in visually engaging graphs and charts, making it easier to analyze trends and plan ahead.</p>
          </div>
        </div>
      </section>

      {/* How to Use the Platform */}
      <section className="content-section usage-section">
        <h2>How to Use the Platform</h2>
        <p>Getting started with water forecasting is easy. Follow these simple steps to use the platform:</p>
        <ol>
          <li><strong>Sign Up:</strong> Create an account on the platform to store your data securely and access the forecasting tools.</li>
          <li><strong>Upload Your Data:</strong> Upload your historical water usage data in CSV format. Make sure the data is well-formatted and complete for accurate predictions.</li>
          <li><strong>Select Forecast Period:</strong> Choose the period for which you want the forecast (e.g., daily, monthly, yearly).</li>
          <li><strong>Analyze Predictions:</strong> View the predicted water demand through charts and graphs. Use the data to make informed decisions on water management and resource allocation.</li>
          <li><strong>Download Results:</strong> Download your forecasted results in CSV format to share or for further analysis.</li>
        </ol>
      </section>

      {/* FAQs */}
      <section className="content-section faq-section">
        <h2>Frequently Asked Questions (FAQ)</h2>
        <div className="faq-item">
          <h3>How accurate are the predictions?</h3>
          <p>The accuracy depends on the quality and granularity of the input data. The more detailed and accurate your data is, the more reliable the predictions will be.</p>
        </div>
        <div className="faq-item">
          <h3>Can I use data from multiple regions?</h3>
          <p>Yes, our platform supports data from multiple regions. You can input region-specific data to generate local forecasts.</p>
        </div>
        <div className="faq-item">
          <h3>What if I don't have weather data?</h3>
          <p>While weather data can enhance the accuracy of forecasts, you can still get reliable results with just water usage data. We recommend adding weather data for more precise predictions, especially in regions with fluctuating climate conditions.</p>
        </div>
        <div className="faq-item">
          <h3>Can I adjust the forecast for specific regions?</h3>
          <p>Yes, you can specify different regions and receive forecasts tailored to each one. This helps in managing water resources efficiently across different areas.</p>
        </div>
      </section>

      {/* Conclusion */}
      <section className="content-section conclusion-section">
        <h2>Conclusion</h2>
        <p>
          Water forecasting is vital for ensuring sustainable water management. By utilizing AI and machine learning, our platform offers precise predictions that can help policymakers, water managers, and communities plan for future water needs. We hope this documentation helps you understand how the platform works and how you can use it to manage water resources effectively. If you need further assistance, feel free to contact our support team.
        </p>
      </section>

      <Footer/>
    </div>
  );
}

export default DocumentationPage;
