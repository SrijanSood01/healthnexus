import React from "react";
import "./PharmacyDashboard.css"

function PharmacyDashboard() {
  return (
    <div className="dashboard pharmacy-dashboard">
      <h2>Pharmacy Dashboard</h2>

      {/* Quick Stats */}
      <section className="pharmacy-stats">
        <div className="stat-card">
          <h3>150</h3>
          <p>Medicines in Stock</p>
        </div>
        <div className="stat-card">
          <h3>12</h3>
          <p>Low Stock Alerts</p>
        </div>
        <div className="stat-card">
          <h3>25</h3>
          <p>Prescriptions Today</p>
        </div>
      </section>

      {/* Prescription Orders */}
      <section className="prescriptions">
        <h3>Prescription Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Medicine</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Amit Sharma</td>
              <td>Metformin 500mg</td>
              <td>30</td>
              <td><button>Dispense</button></td>
            </tr>
            <tr>
              <td>Priya Singh</td>
              <td>Paracetamol 650mg</td>
              <td>10</td>
              <td><button>Dispense</button></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Inventory Management */}
      <section className="inventory">
        <h3>Inventory Management</h3>
        <ul>
          <li>Check Stock Levels</li>
          <li>Add New Medicine</li>
          <li>Update Expiry Dates</li>
          <li>Generate Stock Report</li>
        </ul>
      </section>
    </div>
  );
}

export default PharmacyDashboard;
