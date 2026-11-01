const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ================= MIDDLEWARE =================

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5000',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        // Allow localhost development
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }

        // Allow all Vercel deployments (*.vercel.app)
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        // Allow explicit CLIENT_URL if defined
        if (process.env.CLIENT_URL) {
            const cleanClientUrl = process.env.CLIENT_URL.trim().replace(/\/$/, '');
            if (cleanClientUrl === '*' || origin === cleanClientUrl) {
                return callback(null, true);
            }
        }

        // Allow by default to prevent deployment blocking
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Explicit OPTIONS preflight handling
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= DATABASE CONNECTION =================

// ================= API ROUTES =================

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// ================= HEALTH CHECK =================

app.get('/api/health', (req, res) => {

    res.status(200).json({
        success: true,
        status: 'online',

        project: 'SYMPORA - Symposium & Workshop Registration System',

        author: 'Jaishree K',

        database: {
            type: 'MongoDB Atlas',
            status: mongoose.connection.readyState === 1
                ? 'Connected'
                : 'Disconnected',
            name: mongoose.connection.name || 'Not Connected'
        },

        timestamp: new Date().toISOString()
    });

});

// ================= FRONTEND STATIC FILES =================

const clientDistPath = path.join(__dirname, '../client/dist');

if (fs.existsSync(clientDistPath)) {

    console.log('React frontend build found.');

    app.use(express.static(clientDistPath));

    app.get('*', (req, res, next) => {

        if (req.originalUrl.startsWith('/api')) {
            return next();
        }

        res.sendFile(path.join(clientDistPath, 'index.html'));

    });

}

// ================= API NOT FOUND =================

app.use('/api', (req, res) => {

    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });

});

// ================= GLOBAL ERROR HANDLER =================

app.use((err, req, res, next) => {

    console.error('Server Error:', err.message);

    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development'
            ? err.message
            : undefined
    });

});

// ================= START SERVER =================

const startServer = async () => {

    try {

        console.log('Connecting to MongoDB Atlas...');

        await connectDB();

        app.listen(PORT, () => {

            console.log('======================================');
            console.log('SYMPORA SERVER STARTED');
            console.log('Project Owner: Jaishree K');
            console.log(`Port: ${PORT}`);
            console.log(`API Health: /api/health`);
            console.log('MongoDB connection successful');
            console.log('======================================');

        });

    } catch (error) {

        console.error('MongoDB Connection Failed:', error.message);

        process.exit(1);

    }

};

startServer();