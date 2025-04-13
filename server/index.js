const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock user data (replace with database in production)
const users = {
    'owner@example.com': {
        password: 'password123',
        role: 'owner',
        name: 'Restaurant Owner'
    }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Login route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users[email];

    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email, role: user.role }, 'your_jwt_secret', { expiresIn: '24h' });
    res.json({ token, user: { email, role: user.role, name: user.name } });
});

// Dashboard data route
app.get('/api/dashboard', authenticateToken, (req, res) => {
    // Mock dashboard data
    const dashboardData = {
        todayOrders: 25,
        revenue: 1250,
        newCustomers: 12,
        rating: 4.8,
        recentOrders: [
            {
                id: '12345',
                items: '2x Margherita Pizza, 1x Coke',
                time: '10 minutes ago',
                status: 'pending'
            },
            {
                id: '12344',
                items: '1x Chicken Burger, 1x Fries',
                time: '25 minutes ago',
                status: 'completed'
            }
        ],
        popularItems: [
            {
                name: 'Margherita Pizza',
                orderCount: 50,
                image: '/photos/pizza.jpg'
            },
            {
                name: 'Chicken Burger',
                orderCount: 35,
                image: '/photos/burger.jpg'
            }
        ]
    };

    res.json(dashboardData);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 