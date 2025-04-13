import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    if (localStorage.getItem('isLoggedIn')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo purposes, using hardcoded credentials
    if (email === 'owner@example.com' && password === 'password123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'owner');
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');
    } else {
      alert('Invalid credentials! Please try again.\nUse:\nEmail: owner@example.com\nPassword: password123');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Restaurant Owner Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="login-help" style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
          <p>Use these credentials:</p>
          <p>Email: owner@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 