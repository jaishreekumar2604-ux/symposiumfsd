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

// ================= MANUAL SEED TRIGGER =================

app.get('/api/seed', async (req, res) => {
    try {
        const User = require('./models/User');
        const Event = require('./models/Event');

        let adminUser = await User.findOne({ email: 'jaishree@sympora.edu' });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'Jaishree K',
                email: 'jaishree@sympora.edu',
                password: 'Admin@123',
                role: 'admin',
                department: 'Computer Science & Engineering',
                college: 'College of Engineering & Technology',
                rollNumber: '26CSE001',
                phone: '+91 98765 43210',
            });
        }

        let studentUser = await User.findOne({ email: 'rahul@student.edu' });
        if (!studentUser) {
            studentUser = await User.create({
                name: 'Rahul Sharma',
                email: 'rahul@student.edu',
                password: 'User@123',
                role: 'student',
                department: 'Computer Science & Engineering',
                college: 'College of Engineering & Technology',
                rollNumber: '26CSE045',
                phone: '+91 98111 22334',
            });
        }

        const eventsCount = await Event.countDocuments();
        if (eventsCount === 0) {
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
                    description: 'A 24-hour sprint to build decentralized applications, zero-trust cloud infrastructure, and fintech microservices.',
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

        res.status(200).json({
            success: true,
            message: 'Database checked and seeded successfully in MongoDB Atlas!',
            adminAccount: 'jaishree@sympora.edu (Password: Admin@123)',
            studentAccount: 'rahul@student.edu (Password: User@123)',
            eventsCount: await Event.countDocuments()
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ================= ROOT LANDING PAGE =================

app.get('/', (req, res) => {
    if (fs.existsSync(clientDistPath)) {
        return res.sendFile(path.join(clientDistPath, 'index.html'));
    }

    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SYMPORA Backend API - Jaishree K</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0b0f19; color: #f8fafc; padding: 20px; display: flex; align-items: center; justify-content: center; min-height: 90vh; margin: 0; }
          .card { max-width: 520px; width: 100%; background: #111827; padding: 36px 28px; border-radius: 20px; border: 1px solid #1f2937; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          .badge { display: inline-block; background: rgba(99, 102, 241, 0.15); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); padding: 6px 14px; border-radius: 999px; font-weight: 700; font-size: 12px; margin-bottom: 16px; letter-spacing: 0.5px; }
          h1 { color: #ffffff; font-size: 24px; margin: 0 0 10px 0; font-weight: 800; }
          p { color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; }
          .status { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; color: #34d399; font-weight: 600; margin-bottom: 24px; background: rgba(16, 185, 129, 0.1); padding: 8px 16px; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.2); }
          .dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; animation: pulse 2s infinite; }
          .btn-group { display: flex; flex-direction: column; gap: 10px; }
          .btn { display: block; padding: 12px 20px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; transition: 0.2s; }
          .btn-primary { background: #6366f1; color: white; }
          .btn-primary:hover { background: #4f46e5; }
          .btn-secondary { background: #1f2937; color: #e5e7eb; border: 1px solid #374151; }
          .btn-secondary:hover { background: #374151; }
          @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.9); } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">SYMPORA BACKEND API • JAISHREE K</div>
          <h1>Server is Live & Connected 🚀</h1>
          <div class="status"><span class="dot"></span> MongoDB Atlas Connected</div>
          <p>This is the Node.js / Express backend service powering the Symposium Management & Workshop Registration portal.</p>
          <div class="btn-group">
            <a class="btn btn-primary" href="https://symposiumfsd.vercel.app" target="_blank">👉 Open Live Frontend Website</a>
            <a class="btn btn-secondary" href="/api/health">Check API Health Status (JSON)</a>
          </div>
        </div>
      </body>
      </html>
    `);
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
