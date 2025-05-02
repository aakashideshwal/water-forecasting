import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage"; // your current landing page
import ForecastingPage from "./ForecastingPage"; // new forecasting page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forecast" element={<ForecastingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
