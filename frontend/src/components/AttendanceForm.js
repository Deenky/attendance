import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

function AttendanceForm() {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeID: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      const response = await axios.post(`${API_BASE_URL}/attendance`, formData);
      
      setAlert({
        show: true,
        type: 'success',
        message: 'Attendance recorded successfully!'
      });

      // Reset form
      setFormData({
        employeeName: '',
        employeeID: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });
    } catch (error) {
      console.error('Error submitting attendance:', error);
      setAlert({
        show: true,
        type: 'danger',
        message: 'Error submitting attendance. Please make sure the backend server is running on port 5000.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow">
          <div className="card-header text-center bg-primary text-white">
            <h4 className="mb-0">Mark Employee Attendance</h4>
          </div>
          <div className="card-body">
            {alert.show && (
              <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                {alert.message}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setAlert({ show: false })}
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Employee Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Employee ID *</label>
                <input
                  type="text"
                  className="form-control"
                  name="employeeID"
                  value={formData.employeeID}
                  onChange={handleChange}
                  placeholder="Enter employee ID"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Attendance Status *</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div className="d-grid">
                <button 
                  className="btn btn-primary btn-lg"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Attendance'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceForm;