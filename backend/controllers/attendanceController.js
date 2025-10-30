import Attendance from '../models/attendanceModel.js';

export const markAttendance = async (req, res) => {
  try {
    const { employeeName, employeeID, date, status } = req.body;

    // Validation
    if (!employeeName || !employeeID || !date || !status) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (!['Present', 'Absent'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status must be either Present or Absent' 
      });
    }

    const newRecord = await Attendance.create({ 
      employeeName, 
      employeeID, 
      date, 
      status 
    });

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: newRecord
    });
  } catch (error) {
    console.error('Database error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Attendance already recorded for this employee on the specified date'
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Error saving attendance record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.getAll();
    
    res.json({
      success: true,
      data: records,
      count: records.length
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching attendance records',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeID } = req.params;
    const records = await Attendance.getByEmployeeID(employeeID);
    
    res.json({
      success: true,
      data: records,
      count: records.length
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching attendance records',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Attendance.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting attendance record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};