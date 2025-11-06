import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "doctor",
  });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // ✅ controls popup visibility

  const token = localStorage.getItem("token");

  // Fetch all users
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        else setMessage(data.message || "Failed to fetch users");
      })
      .catch((err) => console.error(err));
  }, [token]);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle create user
  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setForm({ name: "", email: "", password: "", role: "doctor" });
        setShowModal(false); // ✅ close modal after success

        // Refresh user list
        const updated = await fetch("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json());
        setUsers(updated);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="dashboard admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Quick Stats */}
      <section className="admin-stats">
        <div className="stat-card">
          <h3>{users.filter((u) => u.role === "patient").length}</h3>
          <p>Total Patients</p>
        </div>
        <div className="stat-card">
          <h3>
            {users.filter((u) =>
              ["doctor", "pharmacy", "pathology"].includes(u.role)
            ).length}
          </h3>
          <p>Staff Members</p>
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

      {/* Button to open modal */}
      <section className="create-user-button">
        <button onClick={() => setShowModal(true)}>➕ Add New Staff</button>
      </section>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >
            <h3>Add New Staff</h3>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="doctor">Doctor</option>
                <option value="pharmacy">Pharmacy Staff</option>
                <option value="pathology">Pathology Staff</option>
              </select>

              <div className="modal-actions">
                <button type="submit">Create</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
            {message && <p className="status-msg">{message}</p>}
          </div>
        </div>
      )}

      {/* User Management Table */}
      <section className="user-management">
        <h3>All Users</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.role}</td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AdminDashboard;
