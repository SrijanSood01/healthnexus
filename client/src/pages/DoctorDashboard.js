import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { FaChevronRight, FaEye } from "react-icons/fa";
import "./DoctorDashboard.css";

const API_BASE_URL = "http://localhost:5000/api";

const initialDoctorForm = {
  specialization: "",
  experience: "",
  consultationFee: "",
};

const initialPrescriptionForm = {
  patientId: "",
  medicineName: "",
  dosage: "",
  frequency: "",
  notes: "",
};

function DoctorDashboard() {
  const [pageLoading, setPageLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [prescriptionSubmitting, setPrescriptionSubmitting] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctorForm, setDoctorForm] = useState(initialDoctorForm);
  const [prescriptionForm, setPrescriptionForm] = useState(initialPrescriptionForm);
  const [doctorErrors, setDoctorErrors] = useState({});
  const [prescriptionErrors, setPrescriptionErrors] = useState({});
  const [pageError, setPageError] = useState("");
  const [expandedAppointmentId, setExpandedAppointmentId] = useState(null);

  const initializedRef = useRef(false);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("name") || "Doctor";

  const uniquePatients = useMemo(() => {
    const patientMap = new Map();

    appointments.forEach((appointment) => {
      if (appointment.patientId?._id) {
        patientMap.set(appointment.patientId._id, appointment.patientId);
      }
    });

    return Array.from(patientMap.values());
  }, [appointments]);

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleDateString();
  };

  const toggleAppointmentDetails = (appointmentId) => {
    setExpandedAppointmentId((currentValue) => (currentValue === appointmentId ? null : appointmentId));
  };

  const validateDoctorForm = () => {
    const nextErrors = {};

    if (!doctorForm.specialization.trim()) nextErrors.specialization = "Specialization is required.";
    if (!doctorForm.experience) nextErrors.experience = "Experience is required.";

    setDoctorErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validatePrescriptionForm = () => {
    const nextErrors = {};

    if (!prescriptionForm.patientId) nextErrors.patientId = "Select a patient.";
    if (!prescriptionForm.medicineName.trim()) nextErrors.medicineName = "Medicine name is required.";
    if (!prescriptionForm.dosage.trim()) nextErrors.dosage = "Dosage is required.";
    if (!prescriptionForm.frequency.trim()) nextErrors.frequency = "Frequency is required.";

    setPrescriptionErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const loadAppointments = async (doctorId) => {
    setAppointmentsLoading(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/appointment/doctor/${doctorId}`);
      setAppointments(response.data.data || []);
    } catch (error) {
      setPageError(error.response?.data?.message || "Failed to load doctor appointments.");
    } finally {
      setAppointmentsLoading(false);
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
        const response = await axios.get(`${API_BASE_URL}/doctor/user/${userId}`);
        const doctorProfile = response.data.data;

        setDoctor(doctorProfile);
        await loadAppointments(doctorProfile._id);
      } catch (error) {
        if (error.response?.status !== 404) {
          setPageError(error.response?.data?.message || "Failed to load doctor dashboard.");
        }
      } finally {
        setPageLoading(false);
      }
    };

    loadDashboard();
  }, [userId]);

  const handleDoctorFormChange = (event) => {
    const { name, value } = event.target;

    setDoctorForm((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));

    setDoctorErrors((currentValue) => ({
      ...currentValue,
      [name]: "",
    }));
  };

  const handlePrescriptionChange = (event) => {
    const { name, value } = event.target;

    setPrescriptionForm((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));

    setPrescriptionErrors((currentValue) => ({
      ...currentValue,
      [name]: "",
    }));
  };

  const handleDoctorProfileSubmit = async (event) => {
    event.preventDefault();

    if (!validateDoctorForm() || profileSubmitting || !userId) {
      return;
    }

    setProfileSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/doctor`, {
        userId,
        specialization: doctorForm.specialization,
        experience: Number(doctorForm.experience),
        consultationFee: doctorForm.consultationFee ? Number(doctorForm.consultationFee) : undefined,
      });

      setDoctor(response.data.data);
      setDoctorForm(initialDoctorForm);
      setDoctorErrors({});
      setPageError("");
      alert(response.data.message);
      await loadAppointments(response.data.data._id);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create doctor profile.");
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePrescriptionSubmit = async (event) => {
    event.preventDefault();

    if (!validatePrescriptionForm() || prescriptionSubmitting || !doctor?._id) {
      return;
    }

    setPrescriptionSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/prescription`, {
        patientId: prescriptionForm.patientId,
        doctorId: doctor._id,
        medicines: [
          {
            name: prescriptionForm.medicineName,
            dosage: prescriptionForm.dosage,
            frequency: prescriptionForm.frequency,
          },
        ],
        notes: prescriptionForm.notes.trim(),
      });

      setPrescriptionForm(initialPrescriptionForm);
      setPrescriptionErrors({});
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create prescription.");
    } finally {
      setPrescriptionSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="dashboard-page doctor-dashboard">
        <div className="dashboard-shell">
          <div className="loading-state">Loading doctor dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page doctor-dashboard">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <span className="sidebar-badge">Doctor View</span>
          <h2>{userName}</h2>
          <p>Manage scheduled visits and publish prescriptions with clear, low-friction workflows.</p>

          <div className="sidebar-meta">
            <div className="sidebar-meta-item">
              <span>Profile Status</span>
              <strong>{doctor ? "Completed" : "Pending setup"}</strong>
            </div>
            <div className="sidebar-meta-item">
              <span>Appointments</span>
              <strong>{appointments.length}</strong>
            </div>
            <div className="sidebar-meta-item">
              <span>Patients</span>
              <strong>{uniquePatients.length}</strong>
            </div>
          </div>

          <div className="sidebar-nav">
            <button type="button">
              Schedule <FaChevronRight />
            </button>
            <button type="button">
              Prescriptions <FaChevronRight />
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
                <h1>Doctor Dashboard</h1>
                <p>Stay on top of patient visits and issue prescriptions without extra clicks.</p>
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
                  <span className="stat-label">Patients</span>
                  <span className="stat-value">{uniquePatients.length}</span>
                </article>
                <article className="stat-card">
                  <span className="stat-label">Specialization</span>
                  <span className="stat-value">{doctor?.specialization || "Setup"}</span>
                </article>
              </div>

              {!doctor ? (
                <section className="section-card full-width">
                  <div className="section-heading">
                    <div>
                      <h3>Complete Doctor Profile</h3>
                      <p>Create your doctor profile before handling appointments.</p>
                    </div>
                  </div>

                  <form className="form-grid" onSubmit={handleDoctorProfileSubmit}>
                    <div className="field-group">
                      <label htmlFor="specialization">Specialization</label>
                      <input
                        id="specialization"
                        name="specialization"
                        type="text"
                        value={doctorForm.specialization}
                        onChange={handleDoctorFormChange}
                        className={doctorErrors.specialization ? "input-error" : ""}
                      />
                      {doctorErrors.specialization ? (
                        <span className="field-error">{doctorErrors.specialization}</span>
                      ) : null}
                    </div>

                    <div className="field-group">
                      <label htmlFor="experience">Experience (Years)</label>
                      <input
                        id="experience"
                        name="experience"
                        type="number"
                        value={doctorForm.experience}
                        onChange={handleDoctorFormChange}
                        className={doctorErrors.experience ? "input-error" : ""}
                      />
                      {doctorErrors.experience ? (
                        <span className="field-error">{doctorErrors.experience}</span>
                      ) : null}
                    </div>

                    <div className="field-group full-width">
                      <label htmlFor="consultationFee">Consultation Fee</label>
                      <input
                        id="consultationFee"
                        name="consultationFee"
                        type="number"
                        value={doctorForm.consultationFee}
                        onChange={handleDoctorFormChange}
                      />
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
                          <h3>Doctor Summary</h3>
                          <p>Quick reference for your linked profile and workload.</p>
                        </div>
                      </div>

                      <div className="detail-grid">
                        <div className="detail-item">
                          <span>Name</span>
                          <strong>{doctor.userId?.name || "-"}</strong>
                        </div>
                        <div className="detail-item">
                          <span>Specialization</span>
                          <strong>{doctor.specialization}</strong>
                        </div>
                        <div className="detail-item">
                          <span>Experience</span>
                          <strong>{doctor.experience} years</strong>
                        </div>
                        <div className="detail-item">
                          <span>Consultation Fee</span>
                          <strong>{doctor.consultationFee || "-"}</strong>
                        </div>
                      </div>
                    </section>

                    <section className="section-card">
                      <div className="section-heading">
                        <div>
                          <h3>Create Prescription</h3>
                          <p>Pick a patient from your appointments and create one concise entry.</p>
                        </div>
                      </div>

                      <form className="form-grid" onSubmit={handlePrescriptionSubmit}>
                        <div className="field-group full-width">
                          <label htmlFor="patientId">Patient</label>
                          <select
                            id="patientId"
                            name="patientId"
                            value={prescriptionForm.patientId}
                            onChange={handlePrescriptionChange}
                            className={prescriptionErrors.patientId ? "input-error" : ""}
                          >
                            <option value="">Select patient</option>
                            {uniquePatients.map((patient) => (
                              <option key={patient._id} value={patient._id}>
                                {patient.userId?.name || "Patient"}
                              </option>
                            ))}
                          </select>
                          {prescriptionErrors.patientId ? (
                            <span className="field-error">{prescriptionErrors.patientId}</span>
                          ) : null}
                        </div>

                        <div className="field-group">
                          <label htmlFor="medicineName">Medicine</label>
                          <input
                            id="medicineName"
                            name="medicineName"
                            type="text"
                            value={prescriptionForm.medicineName}
                            onChange={handlePrescriptionChange}
                            className={prescriptionErrors.medicineName ? "input-error" : ""}
                          />
                          {prescriptionErrors.medicineName ? (
                            <span className="field-error">{prescriptionErrors.medicineName}</span>
                          ) : null}
                        </div>

                        <div className="field-group">
                          <label htmlFor="dosage">Dosage</label>
                          <input
                            id="dosage"
                            name="dosage"
                            type="text"
                            value={prescriptionForm.dosage}
                            onChange={handlePrescriptionChange}
                            className={prescriptionErrors.dosage ? "input-error" : ""}
                          />
                          {prescriptionErrors.dosage ? (
                            <span className="field-error">{prescriptionErrors.dosage}</span>
                          ) : null}
                        </div>

                        <div className="field-group">
                          <label htmlFor="frequency">Frequency</label>
                          <input
                            id="frequency"
                            name="frequency"
                            type="text"
                            value={prescriptionForm.frequency}
                            onChange={handlePrescriptionChange}
                            className={prescriptionErrors.frequency ? "input-error" : ""}
                          />
                          {prescriptionErrors.frequency ? (
                            <span className="field-error">{prescriptionErrors.frequency}</span>
                          ) : null}
                        </div>

                        <div className="field-group full-width">
                          <label htmlFor="notes">Notes</label>
                          <textarea id="notes" name="notes" value={prescriptionForm.notes} onChange={handlePrescriptionChange} />
                        </div>

                        <div className="field-group full-width">
                          <button type="submit" className="primary-btn" disabled={prescriptionSubmitting}>
                            {prescriptionSubmitting ? "Saving prescription..." : "Create Prescription"}
                          </button>
                        </div>
                      </form>
                    </section>
                  </div>

                  <section className="section-card full-width">
                    <div className="section-heading">
                      <div>
                        <h3>Appointments</h3>
                        <p>Use the view action to toggle one detail panel at a time.</p>
                      </div>
                    </div>

                    {appointmentsLoading ? (
                      <div className="loading-state">Loading appointments...</div>
                    ) : appointments.length === 0 ? (
                      <div className="empty-state">No appointments assigned yet.</div>
                    ) : (
                      <div className="data-table-wrap">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Patient</th>
                              <th>Phone</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th>View</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointments.map((appointment) => {
                              const isExpanded = expandedAppointmentId === appointment._id;

                              return (
                                <React.Fragment key={appointment._id}>
                                  <tr>
                                    <td>{appointment.patientId?.userId?.name || "-"}</td>
                                    <td>{appointment.patientId?.phone || "-"}</td>
                                    <td>{formatDate(appointment.date)} {appointment.time}</td>
                                    <td>
                                      <span className={`status-pill ${appointment.status}`}>{appointment.status}</span>
                                    </td>
                                    <td>
                                      <button
                                        type="button"
                                        className="icon-btn"
                                        onClick={() => toggleAppointmentDetails(appointment._id)}
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
                                              <span>Patient Address</span>
                                              <strong>{appointment.patientId?.address || "-"}</strong>
                                            </div>
                                            <div className="detail-item">
                                              <span>Patient Gender</span>
                                              <strong>{appointment.patientId?.gender || "-"}</strong>
                                            </div>
                                            <div className="detail-item">
                                              <span>Blood Group</span>
                                              <strong>{appointment.patientId?.bloodGroup || "-"}</strong>
                                            </div>
                                            <div className="detail-item">
                                              <span>Appointment Created</span>
                                              <strong>{formatDate(appointment.createdAt)}</strong>
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

export default DoctorDashboard;
