import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// GET all attendance
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Attendance ORDER BY date DESC, createdAt DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching attendance records' });
  }
});

// POST attendance
router.post('/', async (req, res) => {
  try {
    const { employeeName, employeeID, date, status } = req.body;

    if (!employeeName || !employeeID || !date || !status) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const query = 'INSERT INTO Attendance (employeeName, employeeID, date, status) VALUES (?, ?, ?, ?)';
    const [result] = await pool.execute(query, [employeeName, employeeID, date, status]);

    res.status(201).json({ success: true, message: 'Attendance recorded', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error adding attendance' });
  }
});

export default router;
