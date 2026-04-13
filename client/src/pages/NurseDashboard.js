import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { FaChevronRight, FaEye } from "react-icons/fa";
import "./NurseDashboard.css";

const API_BASE_URL = "http://localhost:5000/api";

function NurseDashboard() {
  const [pageLoading, setPageLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [pageError, setPageError] = useState("");
  const [expandedPatientId, setExpandedPatientId] = useState(null);

  const initializedRef = useRef(false);
  const userName = localStorage.getItem("name") || "Nurse";

  const loadDashboardData = async () => {
    try {
      const [patientsResponse, appointmentsResponse, reportsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/patient`),
        axios.get(`${API_BASE_URL}/appointment`),
        axios.get(`${API_BASE_URL}/report`),
      ]);

      setPatients(patientsResponse.data.data || []);
      setAppointments(appointmentsResponse.data.data || []);
      setReports(reportsResponse.data.data || []);
      setPageError("");
    } catch (error) {
      setPageError(error.response?.data?.message || "Failed to load nurse dashboard.");
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

  const todayAppointments = useMemo(() => {
    const today = new Date().toDateString();

    return appointments.filter((appointment) => {
      if (!appointment.date) {
        return false;
      }

      return new Date(appointment.date).toDateString() === today;
    });
  }, [appointments]);

  const pendingReports = useMemo(
    () => reports.filter((report) => report.status === "pending").length,
    [reports],
  );

  const visiblePatients = useMemo(
    () =>
      patients.filter((patient) => {
        const linkedUser = patient?.userId;

        return Boolean(
          patient?._id &&
            linkedUser?._id &&
            linkedUser?.name &&
            linkedUser?.role?.toLowerCase() === "patient",
        );
      }),
    [patients],
  );

  if (pageLoading) {
    return (
      <div className="dashboard-page nurse-dashboard">
        <div className="dashboard-shell">
          <div className="loading-state">Loading nurse dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page nurse-dashboard">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <span className="sidebar-badge">Nurse View</span>
          <h2>{userName}</h2>
          <p>Track patients, today&apos;s appointments, and care-related updates from one calm workspace.</p>

          <div className="sidebar-meta">
            <div className="sidebar-meta-item">
              <span>Assigned Care Visibility</span>
              <strong>{visiblePatients.length}</strong>
            </div>
            <div className="sidebar-meta-item">
              <span>Today&apos;s Appointments</span>
              <strong>{todayAppointments.length}</strong>
            </div>
            <div className="sidebar-meta-item">
              <span>Reports Pending</span>
              <strong>{pendingReports}</strong>
            </div>
          </div>

          <div className="sidebar-nav">
            <button type="button">
              Patient Care <FaChevronRight />
            </button>
            <button type="button">
              Schedule <FaChevronRight />
            </button>
            <button type="button">
              Follow-up <FaChevronRight />
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-panel">
            <div className="dashboard-header">
              <div>
                <h1>Nurse Dashboard</h1>
                <p>View active patient records, appointment timing, and care-ready information in one place.</p>
              </div>
            </div>

            <div className="dashboard-content">
              {pageError ? <div className="inline-feedback error">{pageError}</div> : null}

              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-label">Patients</span>
                  <span className="stat-value">{visiblePatients.length}</span>
                </article>
                <article className="stat-card">
                  <span className="stat-label">Today</span>
                  <span className="stat-value">{todayAppointments.length}</span>
                </article>
                <article className="stat-card">
                  <span className="stat-label">Pending Reports</span>
                  <span className="stat-value">{pendingReports}</span>
                </article>
              </div>

              <div className="section-grid">
                <section className="section-card">
                  <div className="section-heading">
                    <div>
                      <h3>Care Overview</h3>
                      <p>A quick nursing snapshot for shift awareness.</p>
                    </div>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-item">
                      <span>Total Patient Profiles</span>
                      <strong>{visiblePatients.length}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Scheduled Visits</span>
                      <strong>{appointments.filter((appointment) => appointment.status === "scheduled").length}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Completed Visits</span>
                      <strong>{appointments.filter((appointment) => appointment.status === "completed").length}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Latest Patient</span>
                      <strong>{visiblePatients[0]?.userId?.name || "-"}</strong>
                    </div>
                  </div>
                </section>

                <section className="section-card">
                  <div className="section-heading">
                    <div>
                      <h3>Shift Focus</h3>
                      <p>Easy reminders for the most common nursing tasks.</p>
                    </div>
                  </div>

                  <div className="tag-list">
                    <span className="tag">Vitals Tracking</span>
                    <span className="tag">Patient Support</span>
                    <span className="tag">Medication Follow-up</span>
                    <span className="tag">Doctor Coordination</span>
                    <span className="tag">Report Awareness</span>
                  </div>
                </section>
              </div>

              <section className="section-card full-width">
                <div className="section-heading">
                  <div>
                    <h3>Patient Care List</h3>
                    <p>Expand a patient row to review more details without cluttering the whole table.</p>
                  </div>
                </div>

                {visiblePatients.length === 0 ? (
                  <div className="empty-state">No patient records available.</div>
                ) : (
                  <div className="data-table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Phone</th>
                          <th>Gender</th>
                          <th>Blood Group</th>
                          <th>View</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visiblePatients.map((patient) => {
                          const isExpanded = expandedPatientId === patient._id;
                          const patientAppointments = appointments.filter(
                            (appointment) => appointment.patientId?._id === patient._id,
                          );
                          const patientReports = reports.filter((report) => report.patientId?._id === patient._id);

                          return (
                            <React.Fragment key={patient._id}>
                              <tr>
                                <td>{patient.userId?.name || "-"}</td>
                                <td>{patient.phone || "-"}</td>
                                <td>{patient.gender || "-"}</td>
                                <td>{patient.bloodGroup || "-"}</td>
                                <td>
                                  <button
                                    type="button"
                                    className="icon-btn"
                                    onClick={() =>
                                      setExpandedPatientId((currentValue) =>
                                        currentValue === patient._id ? null : patient._id,
                                      )
                                    }
                                  >
                                    <FaEye />
                                  </button>
                                </td>
                              </tr>
                              {isExpanded ? (
                                <tr className="detail-row">
                                  <td colSpan="5">
                                    <div className="detail-panel">
                                      <div className="detail-grid">
                                        <div className="detail-item">
                                          <span>Address</span>
                                          <strong>{patient.address || "-"}</strong>
                                        </div>
                                        <div className="detail-item">
                                          <span>Date of Birth</span>
                                          <strong>
                                            {patient.dob ? new Date(patient.dob).toLocaleDateString() : "-"}
                                          </strong>
                                        </div>
                                        <div className="detail-item">
                                          <span>Appointments</span>
                                          <strong>{patientAppointments.length}</strong>
                                        </div>
                                        <div className="detail-item">
                                          <span>Reports</span>
                                          <strong>{patientReports.length}</strong>
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
    </div>
  );
}

export default NurseDashboard;
