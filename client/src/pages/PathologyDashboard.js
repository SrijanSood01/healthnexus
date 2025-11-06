import React from "react";
import "./PathologyDashboard.css";


function PathologyDashboard() {
  return (
    <div className="dashboard pathology-dashboard">
      <h2>Pathology Dashboard</h2>

      {/* Quick Stats */}
      <section className="pathology-stats">
        <div className="stat-card">
          <h3>8</h3>
          <p>Pending Tests</p>
        </div>
        <div className="stat-card">
          <h3>20</h3>
          <p>Completed Reports</p>
        </div>
        <div className="stat-card">
          <h3>5</h3>
          <p>Urgent Cases</p>
        </div>
      </section>

      {/* Test Requests */}
      <section className="test-requests">
        <h3>Test Requests</h3>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Test</th>
              <th>Requested By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rajesh Kumar</td>
              <td>X-Ray (Leg)</td>
              <td>Dr. Meera Kapoor</td>
              <td><button>Mark Completed</button></td>
            </tr>
            <tr>
              <td>Sneha Nair</td>
              <td>Blood Sugar Test</td>
              <td>Dr. Anil Verma</td>
              <td><button>Mark Completed</button></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Upload Reports */}
      <section className="upload-reports">
        <h3>Upload Lab Reports</h3>
        <form>
          <label>Patient Name</label>
          <input type="text" placeholder="Enter patient name" />

          <label>Test Name</label>
          <input type="text" placeholder="Enter test name" />

          <label>Upload File</label>
          <input type="file" />

          <button type="submit">Upload</button>
        </form>
      </section>
    </div>
  );
}

export default PathologyDashboard;
