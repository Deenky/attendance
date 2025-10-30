import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
         
          <div className="col-md-6 text-md-end">
            <p className="mb-1">
              <strong>Developed by:</strong> Likomang
            </p>
            <p className="mb-1">
              <strong>Student ID:</strong> 901019691
            </p>
            <p className="mb-0">
              <strong>Academic Year:</strong> year2
            </p>
          </div>
        </div>
        <hr className="my-3 bg-light" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 text-muted">
              &copy; {currentYear} Employee Attendance Tracker. All rights reserved. | 
              Built with React & Node.js | MySQL Database
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;