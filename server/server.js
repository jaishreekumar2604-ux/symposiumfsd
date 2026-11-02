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

// ================= AUTO SEED INITIAL DATA =================

const autoSeedIfEmpty = async () => {
    try {
        const User = require('./models/User');
        const Event = require('./models/Event');

        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('Database empty. Auto-seeding initial users and symposiums...');
            const adminUser = await User.create({
                name: 'Jaishree K',
                email: 'jaishree@sympora.edu',
                password: 'Admin@123',
                role: 'admin',
                department: 'Computer Science & Engineering',
                college: 'College of Engineering & Technology',
                rollNumber: '26CSE001',
                phone: '+91 98765 43210',
            });

            await User.create({
                name: 'Rahul Sharma',
                email: 'rahul@student.edu',
                password: 'User@123',
                role: 'student',
                department: 'Computer Science & Engineering',
                college: 'College of Engineering & Technology',
                rollNumber: '26CSE045',
                phone: '+91 98111 22334',
            });

            const eventCount = await Event.countDocuments();
            if (eventCount === 0) {
                await Event.insertMany([
                    {
                        title: 'INNOVEX 2026: National Technical Symposium',
                        clubName: 'ACM & CSI Student Chapter',
                        category: 'Symposium',
                        department: 'CSE',
                        description: 'Flagship annual technical symposium featuring paper presentations, blind coding challenges, algorithm sprint, UI/UX design battle, and tech quizzes.',
                        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                        time: '09:00 AM - 05:00 PM',
                        venue: 'Dr. APJ Abdul Kalam Auditorium',
                        totalSeats: 120,
                        availableSeats: 120,
                        fee: 0,
                        tags: ['Symposium', 'Coding', 'Prizes'],
                        bannerGradient: 'from-blue-600 via-indigo-600 to-purple-600',
                        organizerContact: {
                            name: 'Jaishree K (Faculty Head)',
                            email: 'jaishree@sympora.edu',
                            phone: '+91 98765 43210',
                        },
                        createdBy: adminUser._id,
                    },
                    {
                        title: 'GenAI & LLM Architecture Masterclass',
                        clubName: 'AI & Data Science Society',
                        category: 'Workshop',
                        department: 'AI & DS',
                        description: 'Deep dive into transformer models, fine-tuning Llama-3, Retrieval-Augmented Generation (RAG) pipelines, and deploying production agentic workflows.',
                        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                        time: '10:00 AM - 04:30 PM',
                        venue: 'Turing Advanced Computing Center',
                        totalSeats: 60,
                        availableSeats: 60,
                        fee: 150,
                        tags: ['Generative AI', 'Deep Learning', 'PyTorch'],
                        bannerGradient: 'from-emerald-500 via-teal-600 to-cyan-700',
                        organizerContact: {
                            name: 'Jaishree K (Chief Mentor)',
                            email: 'jaishree@sympora.edu',
                            phone: '+91 98765 43210',
                        },
                        createdBy: adminUser._id,
                    },
                    {
                        title: 'Autonomous Robotics & ROS2 Hands-on Workshop',
                        clubName: 'Robotics & Automation Club',
                        category: 'Workshop',
                        department: 'ECE',
                        description: 'Build LiDAR-navigated rovers, configure Robot Operating System (ROS2) nodes, integrate micro-controllers, and run computer vision SLAM mapping.',
                        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
                        time: '09:30 AM - 04:00 PM',
                        venue: 'Mechatronics Innovation Center, Hall B',
                        totalSeats: 40,
                        availableSeats: 40,
                        fee: 200,
                        tags: ['Robotics', 'ROS2', 'Embedded Systems'],
                        bannerGradient: 'from-amber-500 via-orange-600 to-red-600',
                        organizerContact: {
                            name: 'Jaishree K',
                            email: 'jaishree@sympora.edu',
                            phone: '+91 98765 43210',
                        },
                        createdBy: adminUser._id,
                    },
                    {
                        title: 'HackHorizon 2026: 24-Hour Web3 & Cloud Hackathon',
                        clubName: 'Open Source Developers Community',
                        category: 'Hackathon',
                        department: 'IT',
                        description: 'A 24-hour sprint to build decentralized applications, zero-trust cloud infrastructure, and fintech microservices. Swags and direct internship interviews.',
                        date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
                        time: '08:00 AM (24 Hours Overnight)',
                        venue: 'Central Incubation & Startup Lounge',
                        totalSeats: 80,
                        availableSeats: 80,
                        fee: 0,
                        tags: ['Hackathon', 'Web3', 'Cloud Native'],
                        bannerGradient: 'from-fuchsia-600 via-purple-600 to-indigo-700',
                        organizerContact: {
                            name: 'Jaishree K (Lead Organizer)',
                            email: 'jaishree@sympora.edu',
                            phone: '+91 98765 43210',
                        },
                        createdBy: adminUser._id,
                    }
                ]);
            }
            console.log('✓ Initial data seeded successfully.');
        }
    } catch (err) {
        console.log('Auto-seed check note:', err.message);
    }
};

// ================= START SERVER =================

const startServer = async () => {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await connectDB();
        await autoSeedIfEmpty();

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
