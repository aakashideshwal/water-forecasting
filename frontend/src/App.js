import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ForecastingPage from "./ForecastingPage";
import DocumentationPage from "./DocumentationPage"; // Make sure this file exists
import UploadPage from './UploadPage';
import ResultPage from "./ResultsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forecast" element={<ForecastingPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
