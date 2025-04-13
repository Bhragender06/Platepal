import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const [ownerData, setOwnerData] = useState({
        name: 'Restaurant Owner',
        todayOrders: 25,
        revenue: 1250,
        newCustomers: 12,
        rating: 4.8
    });

    useEffect(() => {
        // Check authentication
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userRole = localStorage.getItem('userRole');
        
        if (!isLoggedIn || userRole !== 'owner') {
            navigate('/login');
        }

        // Here you would typically fetch data from your backend
        // fetchDashboardData();
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        navigate('/');
    };

    return (
        <>
            <nav className="navbar">
                <div className="logo">
                    <img src="/photos/logo.png" alt="Logo" />
                </div>
                <div className="nav-links">
                    <a href="/dashboard" className="active">Dashboard</a>
                    <a href="/menu-management">Menu</a>
                    <a href="/orders">Orders</a>
                    <a href="/analytics">Analytics</a>
                    <a href="/settings">Settings</a>
                </div>
                <div className="nav-right">
                    <div className="owner-profile">
                        <img src="/photos/default-avatar.png" alt="Owner" className="avatar" />
                        <span className="owner-name">{ownerData.name}</span>
                    </div>
                    <button className="logout-btn" onClick={logout}>Logout</button>
                </div>
            </nav>

            <div className="main-content">
                <div className="dashboard-header">
                    <h1>Welcome Back, {ownerData.name}</h1>
                    <p>Here's your business overview</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <i className="fas fa-shopping-cart"></i>
                        <h3>Today's Orders</h3>
                        <p className="stat-number">{ownerData.todayOrders}</p>
                        <p className="stat-change positive">+15% from yesterday</p>
                    </div>
                    <div className="stat-card">
                        <i className="fas fa-dollar-sign"></i>
                        <h3>Revenue</h3>
                        <p className="stat-number">${ownerData.revenue}</p>
                        <p className="stat-change positive">+8% from yesterday</p>
                    </div>
                    <div className="stat-card">
                        <i className="fas fa-users"></i>
                        <h3>New Customers</h3>
                        <p className="stat-number">{ownerData.newCustomers}</p>
                        <p className="stat-change positive">+20% from yesterday</p>
                    </div>
                    <div className="stat-card">
                        <i className="fas fa-star"></i>
                        <h3>Average Rating</h3>
                        <p className="stat-number">{ownerData.rating}</p>
                        <p className="stat-change neutral">Same as yesterday</p>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card recent-orders">
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

                    <div className="dashboard-card popular-items">
                        <h2>Popular Items</h2>
                        <div className="item-list">
                            <div className="item">
                                <img src="/photos/pizza.jpg" alt="Pizza" />
                                <div className="item-info">
                                    <h3>Margherita Pizza</h3>
                                    <p>Ordered 50 times today</p>
                                </div>
                            </div>
                            <div className="item">
                                <img src="/photos/burger.jpg" alt="Burger" />
                                <div className="item-info">
                                    <h3>Chicken Burger</h3>
                                    <p>Ordered 35 times today</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OwnerDashboard; 