import React from "react";
import './PatientDashboard.css';


function PatientDashboard() {
  return (
    <div className="dashboard patient-dashboard">
      <h2>Patient Dashboard</h2>

      {/* Quick Stats */}
      <section className="patient-stats">
        <div className="stat-card">
          <h3>2</h3>
          <p>Upcoming Appointments</p>
        </div>
        <div className="stat-card">
          <h3>5</h3>
          <p>Active Prescriptions</p>
        </div>
        <div className="stat-card">
          <h3>1</h3>
          <p>Pending Lab Report</p>
        </div>
      </section>

      {/* Upcoming Appointments */}
      <section className="appointments">
        <h3>Upcoming Appointments</h3>
        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dr. Meera Kapoor</td>
              <td>12 Jan, 2026</td>
              <td>10:00 AM</td>
              <td>Cardiology</td>
            </tr>
            <tr>
              <td>Dr. Anil Verma</td>
              <td>18 Jan, 2026</td>
              <td>4:30 PM</td>
              <td>Orthopedics</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Prescriptions */}
      <section className="prescriptions">
        <h3>Active Prescriptions</h3>
        <ul>
          <li>Metformin 500mg – Twice a day</li>
          <li>Vitamin D3 – Once a week</li>
          <li>Paracetamol 650mg – As required</li>
        </ul>
      </section>

      {/* Lab Results */}
      <section className="lab-results">
        <h3>Lab Reports</h3>
        <ul>
          <li>Blood Sugar Test – <strong>Completed</strong> (Download)</li>
          <li>X-Ray (Leg) – <strong>Pending</strong></li>
        </ul>
      </section>

      {/* Billing */}
      <section className="billing">
        <h3>Billing</h3>
        <p>Total Due: ₹1,200</p>
        <button>💳 Pay Bill</button>
      </section>
    </div>
  );
}

export default PatientDashboard;
