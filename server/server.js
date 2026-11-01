const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// Health check / API status route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'Symposium Management & Workshop Registration System',
    author: 'Jaishree K',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Compass (mongodb://127.0.0.1:27017/symposium_portal)',
  });
});

// Serve frontend static build if it exists (Single Localhost Mode)
const clientDistPath = path.join(__dirname, '../client/dist');
const fs = require('fs');

if (fs.existsSync(clientDistPath)) {
  console.log(`\x1b[32m%s\x1b[0m`, `✓ Serving React client in Single Localhost Mode from ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  app.get('*', (req, res) => {
    // Exclude API routes
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ success: false, message: 'API endpoint not found' });
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // If frontend hasn't been built yet, provide informative landing page on http://localhost:5000
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SYMPORA Server - Single Localhost</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center; }
          .card { max-width: 650px; margin: 0 auto; background: #1e293b; padding: 30px; border-radius: 16px; border: 1px solid #334155; }
          h1 { color: #818cf8; margin-bottom: 8px; }
          .badge { display: inline-block; background: #4f46e5; color: white; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 14px; }
          .btn { display: inline-block; background: #6366f1; color: white; padding: 10px 22px; border-radius: 8px; text-decoration: none; margin-top: 15px; font-weight: 600; }
          code { background: #0f172a; padding: 3px 8px; border-radius: 6px; color: #38bdf8; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">Created by Jaishree K</div>
          <h1>SYMPORA API Server Online</h1>
          <p>Symposium Management & Workshop Registration System</p>
          <p>To run with the complete UI on this single localhost port:</p>
          <p><code>npm run build</code> then refresh this page!</p>
          <a class="btn" href="/api/health">Check API Health</a>
        </div>
      </body>
      </html>
    `);
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`\n\x1b[35m========================================================================\x1b[0m`);
  console.log(`\x1b[1m\x1b[36m  🚀 SYMPORA - Symposium & Workshop Registration Portal\x1b[0m`);
  console.log(`\x1b[33m  Project Owner: Jaishree K\x1b[0m`);
  console.log(`\x1b[35m========================================================================\x1b[0m`);
  console.log(`  🌐 Single Localhost URL: \x1b[32mhttp://localhost:${PORT}\x1b[0m`);
  console.log(`  📊 API Health Check:     \x1b[34mhttp://localhost:${PORT}/api/health\x1b[0m`);
  console.log(`  🗄️  MongoDB Compass URI:  \x1b[36mmongodb://127.0.0.1:27017/symposium_portal\x1b[0m`);
  console.log(`\x1b[35m========================================================================\x1b[0m\n`);
});
