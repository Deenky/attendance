import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration using environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database and create table
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database on Railway');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employeeName VARCHAR(255) NOT NULL,
        employeeID VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        status ENUM('Present', 'Absent') NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_attendance (employeeID, date)
      )
    `;

    await connection.execute(createTableQuery);
    console.log('✅ Attendance table is ready');

    connection.release();
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    process.exit(1);
  }
};

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('🎯 Database connection test successful');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

export { pool, initializeDatabase, testConnection };
