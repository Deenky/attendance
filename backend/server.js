import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import attendanceRoutes from './routes/attendanceRoutes.js';
import { initializeDatabase, testConnection } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/attendance', attendanceRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({ 
    success: true, 
    message: 'Server is running', 
    database: dbStatus ? 'Connected to MySQL on Railway' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Employee Attendance Tracker API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      attendance: '/api/attendance'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Database: Railway MySQL`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
