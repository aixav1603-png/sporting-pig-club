const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Import middlewares de autenticación
const { authMiddleware, adminMiddleware } = require('./middlewares/auth');

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const usersRoutes = require('./routes/users');

// Routes públicas
app.use('/api/auth', authRoutes);

// Routes protegidas
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/users', authMiddleware, adminMiddleware, usersRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Pig Fit Club Backend is Running! 🐷' });
});

// Servir index.html por defecto
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🐷 Pig Fit Club Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
