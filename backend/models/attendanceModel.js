import { pool } from '../config/database.js';

class Attendance {
  static async create(attendanceData) {
    const { employeeName, employeeID, date, status } = attendanceData;
    
    const query = `
      INSERT INTO Attendance2 (employeeName, employeeID, date, status) 
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [employeeName, employeeID, date, status]);
    return { id: result.insertId, ...attendanceData };
  }

  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT * FROM Attendance2 
      ORDER BY date DESC, createdAt DESC
    `);
    return rows;
  }

  static async getByEmployeeID(employeeID) {
    const [rows] = await pool.execute(`
      SELECT * FROM Attendance2 
      WHERE employeeID = ? 
      ORDER BY date DESC
    `, [employeeID]);
    return rows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM Attendance2 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

export default Attendance;