import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaChevronRight, FaEye } from "react-icons/fa";
import "./PharmacyDashboard.css";

const API_BASE_URL = "http://localhost:5000/api";

const initialMedicineForm = {
  name: "",
  stock: "",
  price: "",
};

function PharmacyDashboard() {
  const [pageLoading, setPageLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState(initialMedicineForm);
  const [formErrors, setFormErrors] = useState({});
  const [pageError, setPageError] = useState("");
  const [expandedMedicineId, setExpandedMedicineId] = useState(null);

  const initializedRef = useRef(false);
  const userName = localStorage.getItem("name") || "Pharmacy Team";

  const loadMedicines = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pharmacy`);
      setMedicines(response.data.data || []);
      setPageError("");
    } catch (error) {
      setPageError(error.response?.data?.message || "Failed to load medicines.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    loadMedicines();
  }, []);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Medicine name is required.";
    if (!formData.stock) nextErrors.stock = "Stock is required.";
    if (!formData.price) nextErrors.price = "Price is required.";

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

    if (!validateForm() || formSubmitting) {
      return;
    }

    setFormSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/pharmacy`, {
        name: formData.name.trim(),
        stock: Number(formData.stock),
        price: Number(formData.price),
      });

      setFormData(initialMedicineForm);
      setFormErrors({});
      alert(response.data.message);
      await loadMedicines();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add medicine.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const totalStock = medicines.reduce((sum, medicine) => sum + Number(medicine.stock || 0), 0);
  const lowStockCount = medicines.filter((medicine) => Number(medicine.stock || 0) < 10).length;
  const medicineValue = medicines.reduce(
    (sum, medicine) => sum + Number(medicine.stock || 0) * Number(medicine.price || 0),
    0,
  );

  if (pageLoading) {
    return (
      <div className="dashboard-page pharmacy-dashboard">
        <div className="dashboard-shell">
          <div className="loading-state">Loading pharmacy dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page pharmacy-dashboard">
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <span className="sidebar-badge">Pharmacy View</span>
          <h2>{userName}</h2>
          <p>Manage inventory with a clean overview of stock, value, and low-quantity items.</p>

          <div className="sidebar-meta">
            <div className="sidebar-meta-item">
              <span>Medicines</span>
              <strong>{medicines.length}</strong>
            </div>
            <div className="sidebar-meta-item">
              <span>Total Units</span>
              <strong>{totalStock}</strong>
            </div>
            <div className="sidebar-meta-item">
              <span>Low Stock</span>
              <strong>{lowStockCount}</strong>
            </div>
          </div>

          <div className="sidebar-nav">
            <button type="button">
              Inventory <FaChevronRight />
            </button>
            <button type="button">
              Add Medicine <FaChevronRight />
            </button>
            <button type="button">
              Stock Alerts <FaChevronRight />
            </button>
          </div>
        </aside>

        <main className="dashboard-main">
          <section className="dashboard-panel">
            <div className="dashboard-header">
              <div>
                <h1>Pharmacy Dashboard</h1>
                <p>Keep stock updates structured and prevent duplicate submissions during inventory changes.</p>
              </div>
            </div>

            <div className="dashboard-content">
              {pageError ? <div className="inline-feedback error">{pageError}</div> : null}

              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-label">Medicines</span>
                  <span className="stat-value">{medicines.length}</span>
                </article>
                <article className="stat-card">
                  <span className="stat-label">Low Stock Items</span>
                  <span className="stat-value">{lowStockCount}</span>
                </article>
                <article className="stat-card">
                  <span className="stat-label">Inventory Value</span>
                  <span className="stat-value">{medicineValue}</span>
                </article>
              </div>

              <div className="section-grid">
                <section className="section-card">
                  <div className="section-heading">
                    <div>
                      <h3>Add New Medicine</h3>
                      <p>Submit one clean inventory entry at a time.</p>
                    </div>
                  </div>

                  <form className="form-grid" onSubmit={handleSubmit}>
                    <div className="field-group full-width">
                      <label htmlFor="name">Medicine Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={formErrors.name ? "input-error" : ""}
                      />
                      {formErrors.name ? <span className="field-error">{formErrors.name}</span> : null}
                    </div>

                    <div className="field-group">
                      <label htmlFor="stock">Stock</label>
                      <input
                        id="stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        className={formErrors.stock ? "input-error" : ""}
                      />
                      {formErrors.stock ? <span className="field-error">{formErrors.stock}</span> : null}
                    </div>

                    <div className="field-group">
                      <label htmlFor="price">Price</label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        className={formErrors.price ? "input-error" : ""}
                      />
                      {formErrors.price ? <span className="field-error">{formErrors.price}</span> : null}
                    </div>

                    <div className="field-group full-width">
                      <button type="submit" className="primary-btn" disabled={formSubmitting}>
                        {formSubmitting ? "Adding medicine..." : "Add Medicine"}
                      </button>
                    </div>
                  </form>
                </section>

                <section className="section-card">
                  <div className="section-heading">
                    <div>
                      <h3>Inventory Snapshot</h3>
                      <p>Quick guidance for stock review and replenishment.</p>
                    </div>
                  </div>

                  <div className="detail-grid">
                    <div className="detail-item">
                      <span>Total Units</span>
                      <strong>{totalStock}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Low Stock Alerts</span>
                      <strong>{lowStockCount}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Highest Price Item</span>
                      <strong>
                        {medicines.slice().sort((a, b) => Number(b.price || 0) - Number(a.price || 0))[0]?.name || "-"}
                      </strong>
                    </div>
                    <div className="detail-item">
                      <span>Lowest Stock Item</span>
                      <strong>
                        {medicines.slice().sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))[0]?.name || "-"}
                      </strong>
                    </div>
                  </div>
                </section>
              </div>

              <section className="section-card full-width">
                <div className="section-heading">
                  <div>
                    <h3>Medicine List</h3>
                    <p>Toggle the view icon to open a single medicine detail panel.</p>
                  </div>
                </div>

                {medicines.length === 0 ? (
                  <div className="empty-state">No medicines available.</div>
                ) : (
                  <div className="data-table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Stock</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>View</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicines.map((medicine) => {
                          const isExpanded = expandedMedicineId === medicine._id;
                          const status = Number(medicine.stock || 0) < 10 ? "pending" : "completed";

                          return (
                            <React.Fragment key={medicine._id}>
                              <tr>
                                <td>{medicine.name}</td>
                                <td>{medicine.stock}</td>
                                <td>{medicine.price}</td>
                                <td>
                                  <span className={`status-pill ${status}`}>
                                    {status === "pending" ? "Low stock" : "Healthy"}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="icon-btn"
                                    onClick={() =>
                                      setExpandedMedicineId((currentValue) =>
                                        currentValue === medicine._id ? null : medicine._id,
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
                                          <span>Total Item Value</span>
                                          <strong>{Number(medicine.stock || 0) * Number(medicine.price || 0)}</strong>
                                        </div>
                                        <div className="detail-item">
                                          <span>Created On</span>
                                          <strong>{new Date(medicine.createdAt).toLocaleDateString()}</strong>
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

export default PharmacyDashboard;
