import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OwnerDashboard from './components/OwnerDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<OwnerDashboard />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App; 