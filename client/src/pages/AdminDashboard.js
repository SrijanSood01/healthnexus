import React from "react";
import "./AdminDashboard.css"

function AdminDashboard() {
  return (
    <div className="dashboard admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Quick Stats */}
      <section className="admin-stats">
        <div className="stat-card">
          <h3>120</h3>
          <p>Total Patients</p>
        </div>
        <div className="stat-card">
          <h3>40</h3>
          <p>Doctors & Nurses</p>
        </div>
        <div className="stat-card">
          <h3>12</h3>
          <p>Pending Bills</p>
        </div>
        <div className="stat-card">
          <h3>8</h3>
          <p>Low Stock Medicines</p>
        </div>
      </section>

      {/* User Management */}
      <section className="user-management">
        <h3>User Management</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dr. Arjun Patel</td>
              <td>Doctor</td>
              <td>Active</td>
              <td><button>Deactivate</button></td>
            </tr>
            <tr>
              <td>Priya Mehra</td>
              <td>Patient</td>
              <td>Active</td>
              <td><button>Deactivate</button></td>
            </tr>
            <tr>
              <td>Lab Staff #1</td>
              <td>Pathology</td>
              <td>Suspended</td>
              <td><button>Activate</button></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Reports Section */}
      <section className="reports">
        <h3>Analytics & Reports</h3>
        <ul>
          <li>📊 Hospital Occupancy Report</li>
          <li>💰 Revenue Report</li>
          <li>💊 Medicine Stock Report</li>
          <li>👩‍⚕️ Staff Performance Report</li>
        </ul>
        <button>Generate Report</button>
      </section>
    </div>
  );
}

export default AdminDashboard;
