import React, { useEffect, useState } from "react";
import { FaEye, FaPlus, FaTrash, FaNotesMedical } from "react-icons/fa";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const [tab, setTab] = useState("patients"); // patients | prescriptions
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState({
    medicines: [],
    overallRemarks: "",
  });

  const token = localStorage.getItem("token");

  // ✅ Fetch patients
  useEffect(() => {
    if (tab !== "patients") return;
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setPatients(data);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, [token, tab]);

  // ✅ Fetch doctor prescriptions
  useEffect(() => {
    if (tab !== "prescriptions") return;
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/prescriptions/doctor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setPrescriptions(data);
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
      }
    };
    fetchPrescriptions();
  }, [token, tab]);

  // ✅ Open popup for prescription creation
  const openPopup = (patient) => {
    setSelectedPatient(patient);
    setPrescription({
      medicines: [
        {
          id: Date.now(),
          name: "",
          dosageM: "",
          dosageA: "",
          dosageN: "",
          type: "Tablet",
          quantity: "",
          remarks: "",
        },
      ],
      overallRemarks: "",
    });
    setShowPopup(true);
  };

  // ✅ Add medicine
  const addMedicine = () => {
    setPrescription((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        {
          id: Date.now(),
          name: "",
          dosageM: "",
          dosageA: "",
          dosageN: "",
          type: "Tablet",
          quantity: "",
          remarks: "",
        },
      ],
    }));
  };

  // ✅ Remove medicine
  const removeMedicine = (id) => {
    setPrescription((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((m) => m.id !== id),
    }));
  };

  // ✅ Handle input change
  const handleMedicineChange = (id, field, value) => {
    setPrescription((prev) => ({
      ...prev,
      medicines: prev.medicines.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      ),
    }));
  };

  // ✅ Save prescription to backend
  const handleSavePrescription = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/prescriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId: selectedPatient._id,
          medicines: prescription.medicines,
          overallRemarks: prescription.overallRemarks,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Prescription saved successfully!");
        setShowPopup(false);
        if (tab === "prescriptions") {
          setPrescriptions((prev) => [...prev, data]);
        }
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error while saving prescription");
    }
  };

  return (
    <div className="dashboard doctor-dashboard">
      <h2>Doctor Dashboard</h2>

      {/* Tabs */}
      <div className="tab-buttons">
        <button
          className={tab === "patients" ? "active" : ""}
          onClick={() => setTab("patients")}
        >
          🧍‍♂️ Patients
        </button>
        <button
          className={tab === "prescriptions" ? "active" : ""}
          onClick={() => setTab("prescriptions")}
        >
          📜 Prescriptions
        </button>
      </div>

      {/* Patients View */}
      {tab === "patients" && (
        <section className="patient-list">
          <h3>Assigned Patients</h3>
          {patients.length === 0 ? (
            <p>No patients found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>
                      <button className="icon-btn" onClick={() => openPopup(p)}>
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* Prescriptions View */}
      {tab === "prescriptions" && (
        <section className="prescription-list">
          <h3>Past Prescriptions</h3>
          {prescriptions.length === 0 ? (
            <p>No prescriptions yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Medicines</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((pr) => (
                  <tr key={pr._id}>
                    <td>{pr.patient?.name}</td>
                    <td>{new Date(pr.createdAt).toLocaleDateString()}</td>
                    <td>{pr.medicines.map((m) => m.name).join(", ")}</td>
                    <td>{pr.overallRemarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* Prescription Popup */}
      {showPopup && selectedPatient && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div
            className="popup-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="popup-header">
              <h3>Prescription for {selectedPatient.name}</h3>
              <p>
                <strong>Email:</strong> {selectedPatient.email}
              </p>
            </header>

            {/* Medicine Table */}
            <table className="medicine-table">
              <thead>
                <tr>
                  <th>Sl No.</th>
                  <th>Medicine Name</th>
                  <th>M</th>
                  <th>A</th>
                  <th>N</th>
                  <th>Type</th>
                  <th>Qty/ml</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {prescription.medicines.map((m, idx) => (
                  <tr key={m.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <input
                        value={m.name}
                        onChange={(e) =>
                          handleMedicineChange(m.id, "name", e.target.value)
                        }
                        placeholder="Medicine"
                      />
                    </td>
                    <td>
                      <input
                        value={m.dosageM}
                        onChange={(e) =>
                          handleMedicineChange(m.id, "dosageM", e.target.value)
                        }
                        placeholder="M"
                        style={{ width: "50px" }}
                      />
                    </td>
                    <td>
                      <input
                        value={m.dosageA}
                        onChange={(e) =>
                          handleMedicineChange(m.id, "dosageA", e.target.value)
                        }
                        placeholder="A"
                        style={{ width: "50px" }}
                      />
                    </td>
                    <td>
                      <input
                        value={m.dosageN}
                        onChange={(e) =>
                          handleMedicineChange(m.id, "dosageN", e.target.value)
                        }
                        placeholder="N"
                        style={{ width: "50px" }}
                      />
                    </td>
                    <td>
                      <select
                        value={m.type}
                        onChange={(e) =>
                          handleMedicineChange(m.id, "type", e.target.value)
                        }
                      >
                        <option>Tablet</option>
                        <option>Syrup</option>
                        <option>Injection</option>
                      </select>
                    </td>
                    <td>
                      <input
                        value={m.quantity}
                        onChange={(e) =>
                          handleMedicineChange(m.id, "quantity", e.target.value)
                        }
                        placeholder="ml/nos"
                        style={{ width: "70px" }}
                      />
                    </td>
                    <td>
                      <input
                        value={m.remarks}
                        onChange={(e) =>
                          handleMedicineChange(m.id, "remarks", e.target.value)
                        }
                        placeholder="Remarks"
                      />
                    </td>
                    <td>
                      <button
                        className="icon-btn danger"
                        onClick={() => removeMedicine(m.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="table-actions">
              <button onClick={addMedicine}>
                <FaPlus /> Add Medicine
              </button>
            </div>

            <div className="overall-remarks">
              <h4>Doctor Remarks</h4>
              <textarea
                value={prescription.overallRemarks}
                onChange={(e) =>
                  setPrescription({
                    ...prescription,
                    overallRemarks: e.target.value,
                  })
                }
                placeholder="Enter overall remarks..."
              />
            </div>

            <div className="popup-footer">
              <button className="save-btn" onClick={handleSavePrescription}>
                💾 Save Prescription
              </button>
              <button className="cancel-btn" onClick={() => setShowPopup(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
