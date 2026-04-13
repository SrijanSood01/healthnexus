import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaChevronRight, FaEye } from "react-icons/fa";
import "./PathologyDashboard.css";

const API_BASE_URL = "http://localhost:5000/api";

const initialReportForm = {
  patientId: "",
  doctorId: "",
  testName: "",
  result: "",
  status: "pending",
};

function PathologyDashboard() {
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState(initialReportForm);
  const [formErrors, setFormErrors] = useState({});
  const [pageError, setPageError] = useState("");
  const [expandedReportId, setExpandedReportId] = useState(null);

  const initializedRef = useRef(false);
  const userName = localStorage.getItem("name") || "Pathology Team";

  const loadDashboardData = async () => {
    try {
      const [patientsResponse, doctorsResponse, reportsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/patient`),
        axios.get(`${API_BASE_URL}/doctor`),
        axios.get(`${API_BASE_URL}/report`),
      ]);

      setPatients(patientsResponse.data.data || []);
      setDoctors(doctorsResponse.data.data || []);
      setReports(reportsResponse.data.data || []);
      setPageError("");
    } catch (error) {
      setPageError(error.response?.data?.message || "Failed to load pathology dashboard.");
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

    if (!formData.patientId) nextErrors.patientId = "Patient is required.";
    if (!formData.testName.trim()) nextErrors.testName = "Test name is required.";

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));

    setFormErrors((currentValue) => ({
      ...currentValue,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm() || submitLoading) {
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/report`, {
        patientId: formData.patientId,
        doctorId: formData.doctorId || undefined,
        testName: formData.testName.trim(),
        result: formData.result.trim(),
        status: formData.status,
      });

      setFormData(initialReportForm);
      setFormErrors({});
      alert(response.data.message);
      await loadDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create report.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const pendingReports = reports.filter((report) => report.status === "pending").length;
  const completedReports = reports.filter((report) => report.status === "completed").length;

  if (pageLoading) {
    return (
      <div className="dashboard-page pathology-dashboard">
        <div className="dashboard-shell">
          <div className="loading-state">Loading pathology dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page pathology-dashboard">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <span className="sidebar-badge">Pathology View</span>
          <h2>{userName}</h2>
          <p>Keep report creation consistent, readable, and easy to review across patient records.</p>

          <div className="sidebar-meta">
            <div className="sidebar-meta-item">
              <span>Total Reports</span>
              <strong>{reports.length}</strong>
            </div>
            <div className="sidebar-meta-item">
              <span>Pending Reports</span>
              <strong>{pendingReports}</strong>
            </div>
            <div className="sidebar-meta-item">
              <span>Completed Reports</span>
              <strong>{completedReports}</strong>
            </div>
          </div>

          <div className="sidebar-nav">
            <button type="button">
              Create Report <FaChevronRight />
            </button>
            <button type="button">
              Reports <FaChevronRight />
            </button>
            <button type="button">
              Patients <FaChevronRight />
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-panel">
            <div className="dashboard-header">
              <div>
                <h1>Pathology Dashboard</h1>
                <p>Track pending tests, publish results, and keep report details visible without clutter.</p>
              </div>
            </div>

            <div className="dashboard-content">
              {pageError ? <div className="inline-feedback error">{pageError}</div> : null}

              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-label">Pending</span>
                  <span className="stat-value">{pendingReports}</span>
                </article>
                <article className="stat-card">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value">{completedReports}</span>
                </article>
                <article className="stat-card">
                  <span className="stat-label">Patients</span>
                  <span className="stat-value">{patients.length}</span>
                </article>
              </div>

              <div className="section-grid">
                <section className="section-card">
                  <div className="section-heading">
                    <div>
                      <h3>Create Report</h3>
                      <p>Use the form once per report and avoid duplicate submissions.</p>
                    </div>
                  </div>

                  <form className="form-grid" onSubmit={handleSubmit}>
                    <div className="field-group full-width">
                      <label htmlFor="patientId">Patient</label>
                      <select
                        id="patientId"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleChange}
                        className={formErrors.patientId ? "input-error" : ""}
                      >
                        <option value="">Select patient</option>
                        {patients.map((patient) => (
                          <option key={patient._id} value={patient._id}>
                            {patient.userId?.name || "Patient"}
                          </option>
                        ))}
                      </select>
                      {formErrors.patientId ? <span className="field-error">{formErrors.patientId}</span> : null}
                    </div>

                    <div className="field-group full-width">
                      <label htmlFor="doctorId">Doctor</label>
                      <select id="doctorId" name="doctorId" value={formData.doctorId} onChange={handleChange}>
                        <option value="">Optional doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor._id} value={doctor._id}>
                            {doctor.userId?.name || "Doctor"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="field-group">
                      <label htmlFor="testName">Test Name</label>
                      <input
                        id="testName"
                        name="testName"
                        type="text"
                        value={formData.testName}
                        onChange={handleChange}
                        className={formErrors.testName ? "input-error" : ""}
                      />
                      {formErrors.testName ? <span className="field-error">{formErrors.testName}</span> : null}
                    </div>

                    <div className="field-group">
                      <label htmlFor="status">Status</label>
                      <select id="status" name="status" value={formData.status} onChange={handleChange}>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="field-group full-width">
                      <label htmlFor="result">Result</label>
                      <textarea id="result" name="result" value={formData.result} onChange={handleChange} />
                    </div>

                    <div className="field-group full-width">
                      <button type="submit" className="primary-btn" disabled={submitLoading}>
                        {submitLoading ? "Creating report..." : "Create Report"}
                      </button>
                    </div>
                  </form>
                </section>

                <section className="section-card">
                  <div className="section-heading">
                    <div>
                      <h3>Workflow Summary</h3>
                      <p>Operational snapshot for current pathology activity.</p>
                    </div>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-item">
                      <span>Patient Profiles</span>
                      <strong>{patients.length}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Doctor Profiles</span>
                      <strong>{doctors.length}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Latest Report</span>
                      <strong>{reports[0]?.testName || "-"}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Pending Queue</span>
                      <strong>{pendingReports}</strong>
                    </div>
                  </div>
                </section>
              </div>

              <section className="section-card full-width">
                <div className="section-heading">
                  <div>
                    <h3>Report List</h3>
                    <p>Open one report at a time to view additional details.</p>
                  </div>
                </div>

                {reports.length === 0 ? (
                  <div className="empty-state">No reports available.</div>
                ) : (
                  <div className="data-table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Test</th>
                          <th>Doctor</th>
                          <th>Status</th>
                          <th>View</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((report) => {
                          const isExpanded = expandedReportId === report._id;

                          return (
                            <React.Fragment key={report._id}>
                              <tr>
                                <td>{report.patientId?.userId?.name || "-"}</td>
                                <td>{report.testName}</td>
                                <td>{report.doctorId?.userId?.name || "-"}</td>
                                <td>
                                  <span className={`status-pill ${report.status}`}>{report.status}</span>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="icon-btn"
                                    onClick={() =>
                                      setExpandedReportId((currentValue) =>
                                        currentValue === report._id ? null : report._id,
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
                                          <span>Result</span>
                                          <strong>{report.result || "Pending result"}</strong>
                                        </div>
                                        <div className="detail-item">
                                          <span>Created On</span>
                                          <strong>{new Date(report.createdAt).toLocaleDateString()}</strong>
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

export default PathologyDashboard;
