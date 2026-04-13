import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaChevronRight, FaEye } from "react-icons/fa";
import "./AdminDashboard.css";

const API_BASE_URL = "http://localhost:5000/api";

const initialForm = {
  name: "",
  role: "",
};

function AdminDashboard() {
  const [pageLoading, setPageLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    appointments: 0,
  });
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState("");
  const [pageError, setPageError] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);

  const initializedRef = useRef(false);
  const userName = localStorage.getItem("name") || "Admin";

  const loadDashboardData = async () => {
    try {
      const [statsResponse, usersResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/stats`),
        axios.get(`${API_BASE_URL}/admin/users`),
      ]);

      setStats(statsResponse.data.data || {});
      setUsers(usersResponse.data.data || []);
      setPageError("");
    } catch (error) {
      setPageError(error.response?.data?.message || "Failed to load admin dashboard.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    loadDashboardData();
  }, []);

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.role) nextErrors.role = "Role is required.";

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));

    setFormErrors((currentValue) => ({
      ...currentValue,
      [name]: "",
    }));
  };

  const resetModalState = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedUser(null);
    setForm(initialForm);
    setFormErrors({});
  };

  const addUser = async () => {
    if (!validateForm() || submitLoading) {
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/add-user`, form);
      const credentials = response.data.data;

      alert(
        `User Created\n\nEmployee No: ${credentials.empNo}\nEmail: ${credentials.email}\nPassword: ${credentials.password}`,
      );

      resetModalState();
      await loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create user.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const updateUser = async () => {
    if (!validateForm() || submitLoading || !selectedUser?._id) {
      return;
    }

    setSubmitLoading(true);

    try {
      await axios.put(`${API_BASE_URL}/admin/update-user/${selectedUser._id}`, form);
      resetModalState();
      await loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?") || deleteLoadingId) {
      return;
    }

    setDeleteLoadingId(id);

    try {
      await axios.delete(`${API_BASE_URL}/admin/delete-user/${id}`);
      await loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeleteLoadingId("");
    }
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setForm({
      name: user.name,
      role: user.role,
    });
    setEditMode(true);
    setShowModal(true);
  };

  if (pageLoading) {
    return (
      <div className="dashboard-page admin-dashboard">
        <div className="dashboard-shell">
          <div className="loading-state">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page admin-dashboard">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <span className="sidebar-badge">Admin View</span>
          <h2>{userName}</h2>
          <p>Manage users, review hospital counts, and keep staff records organized with less clutter.</p>

          <div className="sidebar-meta">
            <div className="sidebar-meta-item">
              <span>Total Users</span>
              <strong>{stats.users}</strong>
            </div>
            <div className="sidebar-meta-item">
              <span>Doctors</span>
              <strong>{stats.doctors}</strong>
            </div>
            <div className="sidebar-meta-item">
              <span>Appointments</span>
              <strong>{stats.appointments}</strong>
            </div>
          </div>

          <div className="sidebar-nav">
            <button type="button">
              Staff <FaChevronRight />
            </button>
            <button type="button">
              Activity <FaChevronRight />
            </button>
            <button type="button">
              Overview <FaChevronRight />
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-panel">
            <div className="dashboard-header">
              <div>
                <h1>Admin Dashboard</h1>
                <p>Administrative controls, staffing details, and hospital metrics in one shared layout.</p>
              </div>

              <div className="dashboard-header-actions">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => {
                    setEditMode(false);
                    setForm(initialForm);
                    setFormErrors({});
                    setShowModal(true);
                  }}
                >
                  Add Staff Member
                </button>
              </div>
            </div>

            <div className="dashboard-content">
              {pageError ? <div className="inline-feedback error">{pageError}</div> : null}

              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-label">Users</span>
                  <span className="stat-value">{stats.users}</span>
                </article>
                <article className="stat-card">
                  <span className="stat-label">Doctors</span>
                  <span className="stat-value">{stats.doctors}</span>
                </article>
                <article className="stat-card">
                  <span className="stat-label">Appointments</span>
                  <span className="stat-value">{stats.appointments}</span>
                </article>
              </div>

              <div className="section-grid">
                <section className="section-card">
                  <div className="section-heading">
                    <div>
                      <h3>Operational Snapshot</h3>
                      <p>Useful high-level numbers for staff planning.</p>
                    </div>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-item">
                      <span>Most Recent User</span>
                      <strong>{users[0]?.name || "-"}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Department Mix</span>
                      <strong>{Array.from(new Set(users.map((user) => user.role))).length}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Active Users</span>
                      <strong>{users.filter((user) => user.status === "Active").length}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Suspended Users</span>
                      <strong>{users.filter((user) => user.status === "Suspended").length}</strong>
                    </div>
                  </div>
                </section>

                <section className="section-card">
                  <div className="section-heading">
                    <div>
                      <h3>Reporting Focus</h3>
                      <p>Keep analytics and audits easy to scan.</p>
                    </div>
                  </div>

                  <div className="tag-list">
                    <span className="tag">Hospital Occupancy</span>
                    <span className="tag">Revenue Summary</span>
                    <span className="tag">Medicine Stock</span>
                    <span className="tag">Staff Performance</span>
                  </div>
                </section>
              </div>

              <section className="section-card full-width">
                <div className="section-heading">
                  <div>
                    <h3>User Management</h3>
                    <p>Open one user detail section at a time for a cleaner review flow.</p>
                  </div>
                </div>

                {users.length === 0 ? (
                  <div className="empty-state">No users available.</div>
                ) : (
                  <div className="data-table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => {
                          const statusClass = user.status?.toLowerCase() || "active";
                          const isExpanded = expandedUserId === user._id;

                          return (
                            <React.Fragment key={user._id}>
                              <tr>
                                <td>{user.name}</td>
                                <td>{user.role}</td>
                                <td>
                                  <span className={`status-pill ${statusClass}`}>{user.status}</span>
                                </td>
                                <td>
                                  <div className="tag-list">
                                    <button
                                      type="button"
                                      className="icon-btn"
                                      onClick={() =>
                                        setExpandedUserId((currentValue) =>
                                          currentValue === user._id ? null : user._id,
                                        )
                                      }
                                    >
                                      <FaEye />
                                    </button>
                                    <button type="button" className="secondary-btn" onClick={() => openEdit(user)}>
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      className="ghost-btn"
                                      onClick={() => deleteUser(user._id)}
                                      disabled={deleteLoadingId === user._id}
                                    >
                                      {deleteLoadingId === user._id ? "Deleting..." : "Delete"}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {isExpanded ? (
                                <tr className="detail-row">
                                  <td colSpan="4">
                                    <div className="detail-panel">
                                      <div className="detail-grid">
                                        <div className="detail-item">
                                          <span>Email</span>
                                          <strong>{user.email || "-"}</strong>
                                        </div>
                                        <div className="detail-item">
                                          <span>Employee Number</span>
                                          <strong>{user.empNo || "-"}</strong>
                                        </div>
                                        <div className="detail-item">
                                          <span>Created On</span>
                                          <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
                                        </div>
                                        <div className="detail-item">
                                          <span>Role</span>
                                          <strong>{user.role}</strong>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ) : null}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          </section>
        </main>
      </div>

      {showModal ? (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editMode ? "Edit Staff Member" : "Add Staff Member"}</h3>
              <p>{editMode ? "Update the selected user details." : "Create a new staff account."}</p>
            </div>

            <div className="form-grid">
              <div className="field-group full-width">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className={formErrors.name ? "input-error" : ""}
                />
                {formErrors.name ? <span className="field-error">{formErrors.name}</span> : null}
              </div>

              <div className="field-group full-width">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={formErrors.role ? "input-error" : ""}
                >
                  <option value="">Select role</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="pathology">Pathology</option>
                  <option value="admin">Admin</option>
                </select>
                {formErrors.role ? <span className="field-error">{formErrors.role}</span> : null}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="ghost-btn" onClick={resetModalState}>
                Cancel
              </button>
              <button
                type="button"
                className="primary-btn"
                onClick={editMode ? updateUser : addUser}
                disabled={submitLoading}
              >
                {submitLoading ? "Saving..." : editMode ? "Update User" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AdminDashboard;
