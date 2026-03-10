import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {

  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    appointments: 0
  });

  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    role: ""
  });

  useEffect(() => {

    fetch("http://localhost:5000/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data));

    loadUsers();

  }, []);

  const loadUsers = () => {

    fetch("http://localhost:5000/api/admin/users")
      .then(res => res.json())
      .then(data => setUsers(data));

  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addUser = async () => {

    const res = await fetch(
      "http://localhost:5000/api/admin/add-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      }
    );

    const data = await res.json();

    alert(
      `User Created

Employee No: ${data.empNo}
Email: ${data.email}
Password: ${data.password}`
    );

    setShowModal(false);
    loadUsers();

  };

  const toggleStatus = (index) => {

    const updatedUsers = [...users];

    updatedUsers[index].status =
      updatedUsers[index].status === "Active"
        ? "Suspended"
        : "Active";

    setUsers(updatedUsers);

  };

  const openInfo = (user) => {
    setSelectedUser(user);
    setShowInfo(true);
  };

  return (
    <div className="dashboard admin-dashboard">

      <h2>Admin Dashboard</h2>

      {/* Stats */}
      <section className="admin-stats">

        <div className="stat-card">
          <h3>{stats.users}</h3>
          <p>Total Users</p>
        </div>

        <div className="stat-card">
          <h3>{stats.doctors}</h3>
          <p>Doctors</p>
        </div>

        <div className="stat-card">
          <h3>{stats.appointments}</h3>
          <p>Appointments</p>
        </div>

      </section>


      {/* Add Staff Button */}
      <div className="add-user-btn-container">

        <button
          className="open-form-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Staff
        </button>

      </div>


      {/* Users Table */}
      <section className="user-management">

        <h3>User Management</h3>

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user, index) => (

              <tr key={user._id}>

                <td>{user.name}</td>

                <td>{user.role}</td>

                <td>{user.status}</td>

                <td>
                  <div className="action-buttons">

                    <button onClick={() => toggleStatus(index)}>
                      {user.status === "Active"
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      className="info-btn"
                      onClick={() => openInfo(user)}
                    >
                      ℹ
                    </button>

                  </div>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </section>


      {/* Reports */}
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


      {/* Add User Modal */}
      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>Add Staff</h3>

            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
            />

            <select name="role" onChange={handleChange}>
              <option value="">Select Department</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Pathology">Pathology</option>
              <option value="Radiology">Radiology</option>
              <option value="Admin">Admin</option>
            </select>

            <div className="modal-buttons">

              <button onClick={addUser}>
                Create User
              </button>

              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}


      {/* Info Modal */}
      {showInfo && selectedUser && (

        <div className="modal-overlay">

          <div className="modal">

            <h3>User Information</h3>

            <p><b>Name:</b> {selectedUser.name}</p>
            <p><b>Department:</b> {selectedUser.role}</p>
            <p><b>Employee ID:</b> {selectedUser.empNo}</p>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Password:</b> {selectedUser.password}</p>

            <button
              className="close-btn"
              onClick={() => setShowInfo(false)}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDashboard;