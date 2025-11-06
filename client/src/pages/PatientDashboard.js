import React, { useEffect, useState } from "react";
import "./PatientDashboard.css";

function PatientDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPatientDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/patients/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) setDashboardData(data);
      } catch (err) {
        console.error("Error fetching patient dashboard:", err);
      }
    };
    fetchPatientDashboard();
  }, [token]);

  if (!dashboardData) {
    return <p>Loading your dashboard...</p>;
  }

  const { profile, prescriptions, appointments, billing } = dashboardData;

  return (
    <div className="dashboard patient-dashboard">
      <h2>Welcome, {profile.name}</h2>
      <p>Email: {profile.email}</p>

      {/* Quick Stats */}
      <section className="patient-stats">
        <div className="stat-card">
          <h3>{appointments.length}</h3>
          <p>Upcoming Appointments</p>
        </div>
        <div className="stat-card">
          <h3>{prescriptions.length}</h3>
          <p>Active Prescriptions</p>
        </div>
        <div className="stat-card">
          <h3>1</h3>
          <p>Pending Lab Report</p>
        </div>
      </section>

      {/* Appointments */}
      <section className="appointments">
        <h3>Upcoming Appointments</h3>
        {appointments.length === 0 ? (
          <p>No upcoming appointments yet.</p>
        ) : (
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
              {appointments.map((a, i) => (
                <tr key={i}>
                  <td>{a.doctorName}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td>{a.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Prescriptions */}
      <section className="prescriptions">
        <h3>My Prescriptions</h3>
        {prescriptions.length === 0 ? (
          <p>No prescriptions yet.</p>
        ) : (
          prescriptions.map((p) => (
            <div key={p._id} className="prescription-card">
              <h4>
                From Dr. {p.doctor?.name} –{" "}
                {new Date(p.createdAt).toLocaleDateString()}
              </h4>
              <ul>
                {p.medicines.map((m, i) => (
                  <li key={i}>
                    {m.name} ({m.type}) – {m.dosageM && "M"} {m.dosageA && "A"}{" "}
                    {m.dosageN && "N"} | Qty: {m.quantity}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Remarks:</strong> {p.overallRemarks}
              </p>
            </div>
          ))
        )}
      </section>

      {/* Billing */}
      <section className="billing">
        <h3>Billing</h3>
        <p>Total Due: ₹{billing.totalDue}</p>
        <button>💳 Pay Bill</button>
      </section>
    </div>
  );
}

export default PatientDashboard;
