import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import AttendanceForm from './components/AttendanceForm';
import AttendanceDashboard from './components/AttendanceDashboard';
import Footer from './components/Footer'; // Add this line
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Navigation />
        <div className="container mt-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Navigate to="/form" replace />} />
            <Route path="/form" element={<AttendanceForm />} />
            <Route path="/dashboard" element={<AttendanceDashboard />} />
          </Routes>
        </div>
        <Footer /> {/* Add this line */}
      </div>
    </Router>
  );
}

export default App;