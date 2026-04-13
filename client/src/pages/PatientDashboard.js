import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaChevronRight, FaEye } from "react-icons/fa";
import "./PatientDashboard.css";

const API_BASE_URL = "http://localhost:5000/api";

const initialProfileForm = {
  dob: "",
  gender: "",
  phone: "",
  address: "",
  bloodGroup: "",
};

const initialAppointmentForm = {
  doctorId: "",
  date: "",
  time: "",
};

function PatientDashboard() {
  const [pageLoading, setPageLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [appointmentSubmitting, setAppointmentSubmitting] = useState(false);
  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [appointmentForm, setAppointmentForm] = useState(initialAppointmentForm);
  const [profileErrors, setProfileErrors] = useState({});
  const [appointmentErrors, setAppointmentErrors] = useState({});
  const [pageError, setPageError] = useState("");
  const [expandedItem, setExpandedItem] = useState(null);

  const initializedRef = useRef(false);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("name") || "Patient";

  const calculateAge = (dob) => {
    if (!dob) {
      return "-";
    }

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }

    return age;
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleDateString();
  };

  const toggleExpandedItem = (type, id) => {
    setExpandedItem((currentValue) =>
      currentValue?.type === type && currentValue?.id === id ? null : { type, id },
    );
  };

  const validateProfileForm = () => {
    const nextErrors = {};

    if (!profileForm.dob) nextErrors.dob = "Date of birth is required.";
    if (!profileForm.gender) nextErrors.gender = "Gender is required.";
    if (!profileForm.phone.trim()) nextErrors.phone = "Phone is required.";
    if (!profileForm.address.trim()) nextErrors.address = "Address is required.";

    setProfileErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateAppointmentForm = () => {
    const nextErrors = {};

    if (!appointmentForm.doctorId) nextErrors.doctorId = "Please select a doctor.";
    if (!appointmentForm.date) nextErrors.date = "Appointment date is required.";
    if (!appointmentForm.time) nextErrors.time = "Appointment time is required.";

    setAppointmentErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const loadPatientContent = async (patientId) => {
    setContentLoading(true);

    try {
      const [appointmentsResponse, prescriptionsResponse, reportsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/appointment/patient/${patientId}`),
        axios.get(`${API_BASE_URL}/prescription/patient/${patientId}`),
        axios.get(`${API_BASE_URL}/report/patient/${patientId}`),
      ]);

      setAppointments(appointmentsResponse.data.data || []);
      setPrescriptions(prescriptionsResponse.data.data || []);
      setReports(reportsResponse.data.data || []);
    } catch (error) {
      setPageError(error.response?.data?.message || "Failed to load your dashboard data.");
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    const loadDashboard = async () => {
      if (!userId) {
        setPageError("User session not found. Please login again.");
        setPageLoading(false);
        return;
      }

      try {
        setPageError("");

        const doctorsResponse = await axios.get(`${API_BASE_URL}/doctor`);
        setDoctors(doctorsResponse.data.data || []);

        try {
          const patientResponse = await axios.get(`${API_BASE_URL}/patient/user/${userId}`);
          const patientProfile = patientResponse.data.data;

          setPatient(patientProfile);
          await loadPatientContent(patientProfile._id);
        } catch (error) {
          if (error.response?.status !== 404) {
            throw error;
          }

          setPatient(null);
          setAppointments([]);
          setPrescriptions([]);
          setReports([]);
        }
      } catch (error) {
        setPageError(error.response?.data?.message || "Failed to load patient dashboard.");
      } finally {
        setPageLoading(false);
      }
    };

    loadDashboard();
  }, [userId]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));

    setProfileErrors((currentValue) => ({
      ...currentValue,
      [name]: "",
    }));
  };

  const handleAppointmentChange = (event) => {
    const { name, value } = event.target;

    setAppointmentForm((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));

    setAppointmentErrors((currentValue) => ({
      ...currentValue,
      [name]: "",
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    if (!validateProfileForm() || profileSubmitting || !userId) {
      return;
    }

    setProfileSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/patient`, {
        userId,
        ...profileForm,
      });

      const patientProfile = response.data.data;
      setPatient(patientProfile);
      setProfileForm(initialProfileForm);
      setProfileErrors({});
      setPageError("");
      alert(response.data.message);
      await loadPatientContent(patientProfile._id);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create patient profile.");
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handleAppointmentSubmit = async (event) => {
    event.preventDefault();

    if (!validateAppointmentForm() || appointmentSubmitting || !patient?._id) {
      return;
    }

    setAppointmentSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/appointment`, {
        patientId: patient._id,
        doctorId: appointmentForm.doctorId,
        date: appointmentForm.date,
        time: appointmentForm.time,
      });

      setAppointmentForm(initialAppointmentForm);
      setAppointmentErrors({});
      alert(response.data.message);
      await loadPatientContent(patient._id);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create appointment.");
    } finally {
      setAppointmentSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="dashboard-page patient-dashboard">
        <div className="dashboard-shell">
          <div className="loading-state">Loading patient dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page patient-dashboard">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <span className="sidebar-badge">Patient View</span>
          <h2>{userName}</h2>
          <p>Track appointments, prescriptions, and reports from one clean workspace.</p>

          <div className="sidebar-meta">
            <div className="sidebar-meta-item">
              <span>Profile Status</span>
              <strong>{patient ? "Completed" : "Pending setup"}</strong>
            </div>
            <div className="sidebar-meta-item">
              <span>Upcoming Visits</span>
              <strong>{appointments.length}</strong>
            </div>
            <div className="sidebar-meta-item">
              <span>Available Doctors</span>
              <strong>{doctors.length}</strong>
            </div>
          </div>

          <div className="sidebar-nav">
            <button type="button">
              Profile <FaChevronRight />
            </button>
            <button type="button">
              Appointments <FaChevronRight />
            </button>
            <button type="button">
              Reports <FaChevronRight />
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-panel">
            <div className="dashboard-header">
              <div>
                <h1>Patient Dashboard</h1>
                <p>Everything you need for your care journey stays visible, simple, and up to date.</p>
              </div>
            </div>

            <div className="dashboard-content">
              {pageError ? <div className="inline-feedback error">{pageError}</div> : null}

              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-label">Appointments</span>
                  <span className="stat-value">{appointments.length}</span>
                </article>
                <article className="stat-card">
                  <span className="stat-label">Prescriptions</span>
                  <span className="stat-value">{prescriptions.length}</span>
                </article>
                <article className="stat-card">
                  <span className="stat-label">Reports</span>
                  <span className="stat-value">{reports.length}</span>
                </article>
              </div>

              {!patient ? (
                <section className="section-card full-width">
                  <div className="section-heading">
                    <div>
                      <h3>Complete Your Profile</h3>
                      <p>Finish your patient details before booking appointments.</p>
                    </div>
                  </div>

                  <form className="form-grid" onSubmit={handleProfileSubmit}>
                    <div className="field-group">
                      <label htmlFor="dob">Date of Birth</label>
                      <input
                        id="dob"
                        name="dob"
                        type="date"
                        value={profileForm.dob}
                        onChange={handleProfileChange}
                        className={profileErrors.dob ? "input-error" : ""}
                      />
                      {profileErrors.dob ? <span className="field-error">{profileErrors.dob}</span> : null}
                    </div>

                    <div className="field-group">
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={profileForm.gender}
                        onChange={handleProfileChange}
                        className={profileErrors.gender ? "input-error" : ""}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {profileErrors.gender ? (
                        <span className="field-error">{profileErrors.gender}</span>
                      ) : null}
                    </div>

                    <div className="field-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        className={profileErrors.phone ? "input-error" : ""}
                      />
                      {profileErrors.phone ? <span className="field-error">{profileErrors.phone}</span> : null}
                    </div>

                    <div className="field-group">
                      <label htmlFor="bloodGroup">Blood Group</label>
                      <select id="bloodGroup" name="bloodGroup" value={profileForm.bloodGroup} onChange={handleProfileChange}>
                        <option value="">Select blood group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>

                    <div className="field-group full-width">
                      <label htmlFor="address">Address</label>
                      <textarea
                        id="address"
                        name="address"
                        value={profileForm.address}
                        onChange={handleProfileChange}
                        className={profileErrors.address ? "input-error" : ""}
                      />
                      {profileErrors.address ? (
                        <span className="field-error">{profileErrors.address}</span>
                      ) : null}
                    </div>

                    <div className="field-group full-width">
                      <button type="submit" className="primary-btn" disabled={profileSubmitting}>
                        {profileSubmitting ? "Saving profile..." : "Save Profile"}
                      </button>
                    </div>
                  </form>
                </section>
              ) : (
                <>
                  <div className="section-grid">
                    <section className="section-card">
                      <div className="section-heading">
                        <div>
                          <h3>Profile Summary</h3>
                          <p>Basic details linked to your account.</p>
                        </div>
                      </div>

                      <div className="detail-grid">
                        <div className="detail-item">
                          <span>Name</span>
                          <strong>{patient.userId?.name || "-"}</strong>
                        </div>
                        <div className="detail-item">
                          <span>Age</span>
                          <strong>{calculateAge(patient.dob)}</strong>
                        </div>
                        <div className="detail-item">
                          <span>Blood Group</span>
                          <strong>{patient.bloodGroup || "-"}</strong>
                        </div>
                        <div className="detail-item">
                          <span>Phone</span>
                          <strong>{patient.phone || "-"}</strong>
                        </div>
                      </div>
                    </section>

                    <section className="section-card">
                      <div className="section-heading">
                        <div>
                          <h3>Book Appointment</h3>
                          <p>Choose a doctor and schedule your next visit.</p>
                        </div>
                      </div>

                      <form className="form-grid" onSubmit={handleAppointmentSubmit}>
                        <div className="field-group full-width">
                          <label htmlFor="doctorId">Doctor</label>
                          <select
                            id="doctorId"
                            name="doctorId"
                            value={appointmentForm.doctorId}
                            onChange={handleAppointmentChange}
                            className={appointmentErrors.doctorId ? "input-error" : ""}
                          >
                            <option value="">Select doctor</option>
                            {doctors.map((doctor) => (
                              <option key={doctor._id} value={doctor._id}>
                                {doctor.userId?.name || "Doctor"} - {doctor.specialization}
                              </option>
                            ))}
                          </select>
                          {appointmentErrors.doctorId ? (
                            <span className="field-error">{appointmentErrors.doctorId}</span>
                          ) : null}
                        </div>

                        <div className="field-group">
                          <label htmlFor="date">Date</label>
                          <input
                            id="date"
                            name="date"
                            type="date"
                            value={appointmentForm.date}
                            onChange={handleAppointmentChange}
                            className={appointmentErrors.date ? "input-error" : ""}
                          />
                          {appointmentErrors.date ? <span className="field-error">{appointmentErrors.date}</span> : null}
                        </div>

                        <div className="field-group">
                          <label htmlFor="time">Time</label>
                          <input
                            id="time"
                            name="time"
                            type="time"
                            value={appointmentForm.time}
                            onChange={handleAppointmentChange}
                            className={appointmentErrors.time ? "input-error" : ""}
                          />
                          {appointmentErrors.time ? <span className="field-error">{appointmentErrors.time}</span> : null}
                        </div>

                        <div className="field-group full-width">
                          <button type="submit" className="primary-btn" disabled={appointmentSubmitting}>
                            {appointmentSubmitting ? "Booking..." : "Book Appointment"}
                          </button>
                        </div>
                      </form>
                    </section>
                  </div>

                  <section className="section-card full-width">
                    <div className="section-heading">
                      <div>
                        <h3>Your Appointments</h3>
                        <p>Click the view button to open or hide details.</p>
                      </div>
                    </div>

                    {contentLoading ? (
                      <div className="loading-state">Loading appointments...</div>
                    ) : appointments.length === 0 ? (
                      <div className="empty-state">No appointments available yet.</div>
                    ) : (
                      <div className="data-table-wrap">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Doctor</th>
                              <th>Specialization</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>View</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointments.map((appointment) => {
                              const isExpanded =
                                expandedItem?.type === "appointment" && expandedItem.id === appointment._id;

                              return (
                                <React.Fragment key={appointment._id}>
                                  <tr>
                                    <td>{appointment.doctorId?.userId?.name || "-"}</td>
                                    <td>{appointment.doctorId?.specialization || "-"}</td>
                                    <td>{formatDate(appointment.date)}</td>
                                    <td>
                                      <span className={`status-pill ${appointment.status}`}>{appointment.status}</span>
                                    </td>
                                    <td>
                                      <button
                                        type="button"
                                        className="icon-btn"
                                        onClick={() => toggleExpandedItem("appointment", appointment._id)}
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
                                              <span>Time</span>
                                              <strong>{appointment.time}</strong>
                                            </div>
                                            <div className="detail-item">
                                              <span>Consultation Fee</span>
                                              <strong>{appointment.doctorId?.consultationFee || "-"}</strong>
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

                  <section className="section-card full-width">
                    <div className="section-heading">
                      <div>
                        <h3>Your Prescriptions</h3>
                        <p>Review active medicine instructions and notes.</p>
                      </div>
                    </div>

                    {contentLoading ? (
                      <div className="loading-state">Loading prescriptions...</div>
                    ) : prescriptions.length === 0 ? (
                      <div className="empty-state">No prescriptions available.</div>
                    ) : (
                      <div className="data-table-wrap">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Doctor</th>
                              <th>Medicines</th>
                              <th>Notes</th>
                              <th>View</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prescriptions.map((prescription) => {
                              const isExpanded =
                                expandedItem?.type === "prescription" && expandedItem.id === prescription._id;

                              return (
                                <React.Fragment key={prescription._id}>
                                  <tr>
                                    <td>{prescription.doctorId?.userId?.name || "-"}</td>
                                    <td>{prescription.medicines?.length || 0} item(s)</td>
                                    <td>{prescription.notes || "No notes"}</td>
                                    <td>
                                      <button
                                        type="button"
                                        className="icon-btn"
                                        onClick={() => toggleExpandedItem("prescription", prescription._id)}
                                      >
                                        <FaEye />
                                      </button>
                                    </td>
                                  </tr>
                                  {isExpanded ? (
                                    <tr className="detail-row">
                                      <td colSpan="4">
                                        <div className="detail-panel">
                                          <div className="tag-list">
                                            {prescription.medicines?.map((medicine, index) => (
                                              <span key={`${medicine.name}-${index}`} className="tag">
                                                {medicine.name} - {medicine.dosage} - {medicine.frequency}
                                              </span>
                                            ))}
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

                  <section className="section-card full-width">
                    <div className="section-heading">
                      <div>
                        <h3>Your Reports</h3>
                        <p>Open the detail row to review result and linked doctor information.</p>
                      </div>
                    </div>

                    {contentLoading ? (
                      <div className="loading-state">Loading reports...</div>
                    ) : reports.length === 0 ? (
                      <div className="empty-state">No reports available.</div>
                    ) : (
                      <div className="data-table-wrap">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Test Name</th>
                              <th>Status</th>
                              <th>Doctor</th>
                              <th>View</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reports.map((report) => {
                              const isExpanded = expandedItem?.type === "report" && expandedItem.id === report._id;

                              return (
                                <React.Fragment key={report._id}>
                                  <tr>
                                    <td>{report.testName}</td>
                                    <td>
                                      <span className={`status-pill ${report.status}`}>{report.status}</span>
                                    </td>
                                    <td>{report.doctorId?.userId?.name || "-"}</td>
                                    <td>
                                      <button
                                        type="button"
                                        className="icon-btn"
                                        onClick={() => toggleExpandedItem("report", report._id)}
                                      >
                                        <FaEye />
                                      </button>
                                    </td>
                                  </tr>
                                  {isExpanded ? (
                                    <tr className="detail-row">
                                      <td colSpan="4">
                                        <div className="detail-panel">
                                          <div className="detail-grid">
                                            <div className="detail-item">
                                              <span>Result</span>
                                              <strong>{report.result || "Pending update"}</strong>
                                            </div>
                                            <div className="detail-item">
                                              <span>Created On</span>
                                              <strong>{formatDate(report.createdAt)}</strong>
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
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default PatientDashboard;
