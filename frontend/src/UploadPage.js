import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from './AuthContext';
import "./UploadPage.css";
import Footer from "./Footer";
import PageHeader from "./PageHeader";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setErrorMessage("");
    }
  };
  const handleUploadClick = async () => {
    if (!file) {
      setErrorMessage("Please upload a valid file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
        body: formData
      });
      const data = await res.json();
      console.log(data);
      alert("File uploaded successfully!");
    } catch (err) {
      setErrorMessage("Error uploading file.");
    }
  };
  

  return (
    <div className="upload-page">
      <PageHeader 
        title="Upload Your Water Usage Data"
        subtitle="Upload your historical data and generate AI-powered usage predictions."
      />

      <main className="forecasting-page-content">
        <div className="upload-instructions">
          <h2>How to Upload Your Data</h2>
          <p>
            Ensure your file follows these guidelines:
          </p>
          <ul>
            <li>CSV format is preferred.</li>
            <li>
              Ensure your data contains historical water usage in a time-series
              format.
            </li>
            <li>Make sure your file does not exceed 10MB.</li>
          </ul>
          <p>
            <strong>Note:</strong> Only .csv files are accepted.
          </p>
        </div>

        <div className="file-upload-section">
          <h2>Select Your File</h2>
          <div className="file-input-button-group">
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button className="upload-btn" onClick={handleUploadClick}>
              Upload Data
            </button>
          </div>
        </div>

        {/* Back to Forecasting Button - placed above the footer */}
        <div className="back-to-forecast-btn-container">
          <Link to="/forecast">
            <button className="upload-btn">Back to Forecasting</button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default UploadPage;
