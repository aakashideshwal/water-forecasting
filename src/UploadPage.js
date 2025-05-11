import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import './UploadPage.css';
import Footer from "./Footer";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setErrorMessage("");
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      setErrorMessage("Please upload a valid file.");
      return;
    }
    // Implement file upload logic here
    console.log("File uploaded:", file);
  };

  return (
    <div>
      <div className="upload-header">
        <h1>Upload Your Water Usage Data</h1>
        <p>Follow the instructions below to upload your historical water usage data and start forecasting future water demands.</p>
      </div>

      <div className="upload-instructions">
        <h2>How to Upload Your Data</h2>
        <p>Ensure your file follows these guidelines:</p>
        <ul>
          <li>CSV format is preferred.</li>
          <li>Ensure your data contains historical water usage in a time-series format.</li>
          <li>Make sure your file does not exceed 10MB.</li>
        </ul>
        <p><strong>Note:</strong> Only .csv files are accepted.</p>
      </div>

      <div className="file-upload-section">
        <h2>Select Your File</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button
          className="upload-btn"
          onClick={handleUploadClick}
        >
          Upload Data
        </button>
      </div>

      {/* Back to Forecasting Button - placed above the footer */}
      <div className="back-to-forecast-btn-container">
        <Link to="/forecast">
          <button className="back-to-forecast-btn">Back to Forecasting</button>
        </Link>
      </div>

      <Footer/>
    </div>
  );
}

export default UploadPage;
