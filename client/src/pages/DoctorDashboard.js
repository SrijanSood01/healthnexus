import React from "react";
import { FaEye } from "react-icons/fa"; // 👈 Import Eye icon
import "./DoctorDashboard.css";

function DoctorDashboard() {
  return (
    <div className="dashboard doctor-dashboard">
      <h2>Doctor Dashboard</h2>

      {/* Quick Stats */}
      <section className="doctor-stats">
        <div className="stat-card">
          <h3>10</h3>
          <p>Patients Today</p>
        </div>
        <div className="stat-card">
          <h3>4</h3>
          <p>Pending Lab Reports</p>
        </div>
        <div className="stat-card">
          <h3>2</h3>
          <p>Emergency Cases</p>
        </div>
      </section>

      {/* Patient List */}
      <section className="patient-list">
        <h3>Assigned Patients</h3>
        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Condition</th>
              <th>Next Appointment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Amit Sharma</td>
              <td>Diabetes</td>
              <td>12 Oct, 2025</td>
              <td>
                <button className="icon-btn">
                  <FaEye />
                </button>
              </td>
            </tr>
            <tr>
              <td>Priya Singh</td>
              <td>Flu</td>
              <td>14 Oct, 2025</td>
              <td>
                <button className="icon-btn">
                  <FaEye />
                </button>
              </td>
            </tr>
            <tr>
              <td>Rajesh Kumar</td>
              <td>Fracture</td>
              <td>15 Oct, 2025</td>
              <td>
                <button className="icon-btn">
                  <FaEye />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Quick Actions */}
      <section className="doctor-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button>➕ New Prescription</button>
          <button>🧪 Request Lab Test</button>
          <button>📄 View Reports</button>
          <button>💬 Chat with Nurse</button>
        </div>
      </section>
    </div>
  );
}

export default DoctorDashboard;
  