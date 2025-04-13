import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="logo">
          <h1>Restaurant Dashboard</h1>
        </div>
        <div className="nav-links">
          <button className="nav-link active">Dashboard</button>
          <button className="nav-link">Menu</button>
          <button className="nav-link">Orders</button>
          <button className="nav-link">Analytics</button>
          <button className="nav-link">Settings</button>
        </div>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </nav>

      <div className="main-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <h3>Today's Orders</h3>
            <p className="stat-number">25</p>
            <p className="stat-change positive">+15% from yesterday</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <h3>Revenue</h3>
            <p className="stat-number">$1,250</p>
            <p className="stat-change positive">+8% from yesterday</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <h3>New Customers</h3>
            <p className="stat-number">12</p>
            <p className="stat-change positive">+20% from yesterday</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <h3>Average Rating</h3>
            <p className="stat-number">4.8</p>
            <p className="stat-change neutral">Same as yesterday</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>Recent Orders</h2>
            <div className="order-list">
              <div className="order-item">
                <div className="order-info">
                  <h3>Order #12345</h3>
                  <p>2x Margherita Pizza, 1x Coke</p>
                  <span className="order-time">10 minutes ago</span>
                </div>
                <div className="order-status pending">Pending</div>
              </div>
              <div className="order-item">
                <div className="order-info">
                  <h3>Order #12344</h3>
                  <p>1x Chicken Burger, 1x Fries</p>
                  <span className="order-time">25 minutes ago</span>
                </div>
                <div className="order-status completed">Completed</div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h2>Popular Items</h2>
            <div className="item-list">
              <div className="item">
                <div className="item-info">
                  <h3>Margherita Pizza</h3>
                  <p>Ordered 50 times today</p>
                </div>
              </div>
              <div className="item">
                <div className="item-info">
                  <h3>Chicken Burger</h3>
                  <p>Ordered 35 times today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard; 