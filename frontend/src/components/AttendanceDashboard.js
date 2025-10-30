import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function AttendanceDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      if (!API_BASE_URL) {
        throw new Error('API URL is not set. Please configure REACT_APP_API_URL in your environment.');
      }
      const response = await axios.get(`${API_BASE_URL}/attendance`);
      setAttendance(response.data.data || []);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      if (err.response) {
        // Server responded with status outside 2xx
        setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        // Request made but no response received
        setError('Cannot connect to backend. Please make sure the backend is deployed and the URL is correct.');
      } else {
        // Other errors
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary me-2" role="status"></div>
        <span>Loading attendance records...</span>
      </div>
    );
  }

  return (
    <div className="card shadow">
      <div className="card-header text-center d-flex justify-content-between align-items-center bg-primary text-white">
        <h4 className="mb-0">Attendance Dashboard</h4>
        <div>
          <span className="badge bg-secondary me-2">
            Total Records: {attendance.length}
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={fetchAttendance}>
            Refresh
          </button>
        </div>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger">
            <h5 className="alert-heading">Connection Error</h5>
            {error}
            <hr />
            <div className="d-flex justify-content-between">
              <small>Please ensure the backend server is running and accessible from this frontend.</small>
              <button className="btn btn-outline-danger btn-sm" onClick={fetchAttendance}>
                Retry
              </button>
            </div>
          </div>
        )}

        {attendance.length === 0 && !error ? (
          <div className="text-center py-4">
            <h5>No attendance records found</h5>
            <p className="text-muted">Start by marking some attendance records from the form page.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Employee Name</th>
                  <th>Employee ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Recorded On</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record, index) => (
                  <tr key={record.id}>
                    <td>{index + 1}</td>
                    <td className="fw-bold">{record.employeeName}</td>
                    <td><span className="badge bg-info text-dark">{record.employeeID}</span></td>
                    <td>{formatDate(record.date)}</td>
                    <td>
                      {record.status === 'Present' ? (
                        <span className="badge bg-success">Present</span>
                      ) : (
                        <span className="badge bg-danger">Absent</span>
                      )}
                    </td>
                    <td className="text-muted small">
                      {new Date(record.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceDashboard;
