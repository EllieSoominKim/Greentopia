// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Home from "./pages/Home";
import Detect from "./pages/Detect";
import GoogleMapPage from "./pages/Map";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizeResult";
import Ranking from "./pages/Ranking";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/map" element={<GoogleMapPage />} /> 
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz-result" element={<QuizResult />} />
          <Route path="/ranking" element={<Ranking />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;