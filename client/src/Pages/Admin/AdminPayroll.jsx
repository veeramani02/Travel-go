import React, { useState } from "react";
import {
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiSearch,
  FiDownload,
  FiEdit2,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import "../../Styles/AdminPayroll.css";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const initialDrivers = [
  {
    id: "DRV001",
    name: "Ravi Kumar",
    trips: 142,
    baseSalary: 18000,
    incentive: 3200,
    bonus: 1000,
    deductions: 500,
    status: "Paid",
  },
  {
    id: "DRV002",
    name: "Suresh Babu",
    trips: 98,
    baseSalary: 16000,
    incentive: 2100,
    bonus: 500,
    deductions: 300,
    status: "Pending",
  },
  {
    id: "DRV003",
    name: "Murugan S",
    trips: 175,
    baseSalary: 20000,
    incentive: 4500,
    bonus: 2000,
    deductions: 800,
    status: "Paid",
  },
  {
    id: "DRV004",
    name: "Arjun Raj",
    trips: 60,
    baseSalary: 14000,
    incentive: 1200,
    bonus: 0,
    deductions: 200,
    status: "Pending",
  },
  {
    id: "DRV005",
    name: "Karthik M",
    trips: 130,
    baseSalary: 17500,
    incentive: 2800,
    bonus: 800,
    deductions: 400,
    status: "Paid",
  },
  {
    id: "DRV006",
    name: "Vijay Anand",
    trips: 88,
    baseSalary: 15500,
    incentive: 1900,
    bonus: 300,
    deductions: 250,
    status: "Pending",
  },
];

const monthlyHistory = [
  { month: "March 2025", totalPaid: "₹2,34,500", pending: "₹18,200" },
  { month: "February 2025", totalPaid: "₹2,18,000", pending: "₹12,500" },
  { month: "January 2025", totalPaid: "₹2,45,000", pending: "₹9,800" },
  { month: "December 2024", totalPaid: "₹2,60,000", pending: "₹6,500" },
];

// ─── Helper ───────────────────────────────────────────────────────────────────
const calcFinal = (d) =>
  (d.baseSalary || 0) + (d.incentive || 0) + (d.bonus || 0) - (d.deductions || 0);

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminPayroll() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null); // holds driver being edited
  const [form, setForm] = useState({});

  // Summary stats
  const totalDrivers = drivers.length;
  const monthlySalary = drivers.reduce((s, d) => s + calcFinal(d), 0);
  const totalIncentives = drivers.reduce((s, d) => s + d.incentive, 0);
  const pendingCount = drivers.filter((d) => d.status === "Pending").length;

  // Filtered list
  const visible = drivers.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || d.status === filter;
    return matchSearch && matchFilter;
  });

  // Open modal
  const openModal = (driver) => {
    setModal(driver);
    setForm({
      baseSalary: driver.baseSalary,
      incentive: driver.incentive,
      bonus: driver.bonus,
      deductions: driver.deductions,
      month: "April 2025",
    });
  };

  const closeModal = () => setModal(null);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const handleMarkPaid = () => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === modal.id
          ? {
              ...d,
              baseSalary: form.baseSalary,
              incentive: form.incentive,
              bonus: form.bonus,
              deductions: form.deductions,
              status: "Paid",
            }
          : d
      )
    );
    closeModal();
  };

  const finalPreview = calcFinal(form);

  return (
    <div className="ap-page">
      {/* ── Page Header ── */}
      <div className="ap-header">
        <div>
          <h1 className="ap-title">Driver Payroll Management</h1>
          <p className="ap-subtitle">
            Manage driver salaries, incentives, bonuses, and monthly payments
          </p>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="ap-cards">
        <div className="ap-card ap-card--blue">
          <div className="ap-card__icon">
            <FiUsers />
          </div>
          <div>
            <p className="ap-card__label">Total Drivers</p>
            <h2 className="ap-card__value">{totalDrivers}</h2>
          </div>
        </div>

        <div className="ap-card ap-card--orange">
          <div className="ap-card__icon">
            <FiDollarSign />
          </div>
          <div>
            <p className="ap-card__label">Monthly Salary Expense</p>
            <h2 className="ap-card__value">{fmt(monthlySalary)}</h2>
          </div>
        </div>

        <div className="ap-card ap-card--green">
          <div className="ap-card__icon">
            <FiTrendingUp />
          </div>
          <div>
            <p className="ap-card__label">Total Incentives</p>
            <h2 className="ap-card__value">{fmt(totalIncentives)}</h2>
          </div>
        </div>

        <div className="ap-card ap-card--red">
          <div className="ap-card__icon">
            <FiClock />
          </div>
          <div>
            <p className="ap-card__label">Pending Payments</p>
            <h2 className="ap-card__value">{pendingCount} Drivers</h2>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="ap-controls">
        <div className="ap-search">
          <FiSearch className="ap-search__icon" />
          <input
            type="text"
            placeholder="Search driver by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ap-search__input"
          />
        </div>

        <div className="ap-filters">
          {["All", "Paid", "Pending"].map((opt) => (
            <button
              key={opt}
              className={`ap-filter-btn ${filter === opt ? "ap-filter-btn--active" : ""}`}
              onClick={() => setFilter(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        <button className="ap-export-btn">
          <FiDownload /> Export Payroll
        </button>
      </div>

      {/* ── Payroll Table ── */}
      <div className="ap-table-card">
        <div className="ap-table-wrapper">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Driver ID</th>
                <th>Driver Name</th>
                <th>Trips</th>
                <th>Base Salary</th>
                <th>Incentive</th>
                <th>Bonus</th>
                <th>Deductions</th>
                <th>Final Salary</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={10} className="ap-empty">
                    No drivers found.
                  </td>
                </tr>
              ) : (
                visible.map((d) => (
                  <tr key={d.id}>
                    <td className="ap-id">{d.id}</td>
                    <td className="ap-name">{d.name}</td>
                    <td>{d.trips}</td>
                    <td>{fmt(d.baseSalary)}</td>
                    <td>{fmt(d.incentive)}</td>
                    <td>{fmt(d.bonus)}</td>
                    <td className="ap-deduction">-{fmt(d.deductions)}</td>
                    <td className="ap-final">{fmt(calcFinal(d))}</td>
                    <td>
                      <span
                        className={`ap-badge ${
                          d.status === "Paid" ? "ap-badge--paid" : "ap-badge--pending"
                        }`}
                      >
                        {d.status === "Paid" ? (
                          <FiCheckCircle style={{ marginRight: 4 }} />
                        ) : (
                          <FiAlertCircle style={{ marginRight: 4 }} />
                        )}
                        {d.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="ap-update-btn"
                        onClick={() => openModal(d)}
                      >
                        <FiEdit2 /> Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Monthly History ── */}
      <div className="ap-history">
        <h3 className="ap-section-title">Monthly Payroll History</h3>
        <div className="ap-table-card">
          <div className="ap-table-wrapper">
            <table className="ap-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Salary Paid</th>
                  <th>Pending Amount</th>
                </tr>
              </thead>
              <tbody>
                {monthlyHistory.map((h) => (
                  <tr key={h.month}>
                    <td className="ap-name">{h.month}</td>
                    <td className="ap-final">{h.totalPaid}</td>
                    <td className="ap-deduction">{h.pending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Update Modal ── */}
      {modal && (
        <div className="ap-overlay" onClick={closeModal}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal__header">
              <h3>Update Payroll</h3>
              <button className="ap-modal__close" onClick={closeModal}>
                <FiX />
              </button>
            </div>

            <div className="ap-modal__body">
              {/* Driver Name (readonly) */}
              <div className="ap-field">
                <label>Driver Name</label>
                <input type="text" value={modal.name} readOnly className="ap-input ap-input--readonly" />
              </div>

              <div className="ap-field-row">
                <div className="ap-field">
                  <label>Base Salary (₹)</label>
                  <input
                    type="number"
                    value={form.baseSalary}
                    onChange={(e) => handleFormChange("baseSalary", e.target.value)}
                    className="ap-input"
                  />
                </div>
                <div className="ap-field">
                  <label>Incentive (₹)</label>
                  <input
                    type="number"
                    value={form.incentive}
                    onChange={(e) => handleFormChange("incentive", e.target.value)}
                    className="ap-input"
                  />
                </div>
              </div>

              <div className="ap-field-row">
                <div className="ap-field">
                  <label>Bonus (₹)</label>
                  <input
                    type="number"
                    value={form.bonus}
                    onChange={(e) => handleFormChange("bonus", e.target.value)}
                    className="ap-input"
                  />
                </div>
                <div className="ap-field">
                  <label>Deductions (₹)</label>
                  <input
                    type="number"
                    value={form.deductions}
                    onChange={(e) => handleFormChange("deductions", e.target.value)}
                    className="ap-input"
                  />
                </div>
              </div>

              <div className="ap-field">
                <label>Month</label>
                <input
                  type="text"
                  value={form.month}
                  onChange={(e) => setForm((p) => ({ ...p, month: e.target.value }))}
                  className="ap-input"
                />
              </div>

              {/* Auto-calculated Final Salary */}
              <div className="ap-final-box">
                <span>Final Salary</span>
                <span className="ap-final-box__amount">{fmt(finalPreview)}</span>
              </div>
              <p className="ap-formula">
                = Base Salary + Incentive + Bonus − Deductions
              </p>
            </div>

            <div className="ap-modal__footer">
              <button className="ap-cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button className="ap-paid-btn" onClick={handleMarkPaid}>
                <FiCheckCircle /> Mark as Paid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}