import React, { useState, useEffect, useRef } from "react";
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
import API_BASE_URL from "../../config/api";
import { CSVLink } from "react-csv";

const calcFinal = (d) =>
  (d.baseSalary || 0) +
  (d.incentive || 0) +
  (d.bonus || 0) -
  (d.deductions || 0);
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
};
const generateMonthlyHistory = (drivers) => {
  const totalPaid = drivers
    .filter((d) => d.status === "Paid")
    .reduce((sum, d) => sum + calcFinal(d), 0);

  const pendingAmount = drivers
    .filter((d) => d.status === "Pending")
    .reduce((sum, d) => sum + calcFinal(d), 0);

  return [
    {
      month: getCurrentMonth(),
      totalPaid: fmt(totalPaid),
      pending: fmt(pendingAmount),
    },
  ];
};
export default function AdminPayroll() {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const totalDrivers = drivers.length;
  const monthlySalary = drivers.reduce((s, d) => s + calcFinal(d), 0);
  const totalIncentives = drivers.reduce((s, d) => s + d.incentive, 0);
  const pendingCount = drivers.filter((d) => d.status === "Pending").length;
  const monthlyHistory = generateMonthlyHistory(drivers);
  const visible = drivers.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || d.status === filter;
    return matchSearch && matchFilter;
  });
  const csvRef = useRef();

  useEffect(() => {
    fetchDriversPayroll();
  }, []);
  const fetchDriversPayroll = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/driver/driver`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch drivers");
      }
      const data = await response.json();
      const payrollData = data.map((driver, index) => {
        const totalTrips = driver.totalTrips || 0;
        const baseSalary = 15000;
        const incentive = totalTrips * 200;
        const bonus = totalTrips > 40 ? 3000 : 1000;
        const deductions = 500;
        const currentMonth = getCurrentMonth();
        return {
          id: driver._id || `DRV${index + 1}`,
          name: driver.name,
          trips: totalTrips,
          baseSalary: driver.payroll?.baseSalary || baseSalary,
          incentive: driver.payroll?.incentive || incentive,
          bonus: driver.payroll?.bonus || bonus,
          deductions: driver.payroll?.deductions || deductions,

          status:
            driver.payroll?.month === currentMonth
              ? driver.payroll.status
              : "Pending",
          month: currentMonth,
        };
      });

      setDrivers(payrollData);
    } catch (error) {
      console.error("Payroll Fetch Error:", error);
    }
  };

  const openModal = (driver) => {
    setModal(driver);
    setForm({
      baseSalary: driver.baseSalary,
      incentive: driver.incentive,
      bonus: driver.bonus,
      deductions: driver.deductions,
      month: getCurrentMonth(),
    });
  };

  const closeModal = () => setModal(null);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: Number(value) || 0 }));
  };
  const handleMarkPaid = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/driver/driver/payroll/${modal.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            month: getCurrentMonth(),
            status: "Paid",
            paidDate: new Date(),
            baseSalary: form.baseSalary,
            incentive: form.incentive,
            bonus: form.bonus,
            deductions: form.deductions,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update payroll");
      }

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
                month: getCurrentMonth(),
              }
            : d,
        ),
      );

      closeModal();
    } catch (error) {
      console.error("Payroll Update Error:", error);
    }
  };
  const finalPreview = calcFinal(form);

  const handleDownload = () => {
    csvRef.current.link.click();
  };

  const exportData = () => {
    return visible.map((v) => ({
      DriverName: v.name,
      Trips: v.trips,
      BaseSalary: v.baseSalary,
      Incentive: v.incentive,
      Bonus: v.bonus,
      Deductions: v.deductions,
      FinalSalary: calcFinal(v),
      Status: v.status,
    }));
  };

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <h1 className="ap-title">Driver Payroll Management</h1>
          <p className="ap-subtitle">
            Manage driver salaries, incentives, bonuses, and monthly payments
          </p>
        </div>
      </div>
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
        <button className="ap-export-btn" onClick={handleDownload}>
          <FiDownload /> Export Payroll
        </button>
      </div>
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
                    <td className="ap-id">{d.id.slice(4, 8).toUpperCase()}</td>
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
                          d.status === "Paid"
                            ? "ap-badge--paid"
                            : "ap-badge--pending"
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
                        disabled={d.status === "Paid"}
                      >
                        {d.status === "Paid" ? (
                          <>
                            <FiCheckCircle /> Paid
                          </>
                        ) : (
                          <>
                            <FiEdit2 /> Update
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
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
              <div className="ap-field">
                <label>Driver Name</label>
                <input
                  type="text"
                  value={modal.name}
                  readOnly
                  className="ap-input ap-input--readonly"
                />
              </div>
              <div className="ap-field-row">
                <div className="ap-field">
                  <label>Base Salary (₹)</label>
                  <input
                    type="number"
                    value={form.baseSalary}
                    onChange={(e) =>
                      handleFormChange("baseSalary", e.target.value)
                    }
                    className="ap-input"
                  />
                </div>
                <div className="ap-field">
                  <label>Incentive (₹)</label>
                  <input
                    type="number"
                    value={form.incentive}
                    onChange={(e) =>
                      handleFormChange("incentive", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleFormChange("deductions", e.target.value)
                    }
                    className="ap-input"
                  />
                </div>
              </div>
              <div className="ap-field">
                <label>Month</label>
                <input
                  type="text"
                  value={form.month}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, month: e.target.value }))
                  }
                  className="ap-input"
                />
              </div>
              <div className="ap-final-box">
                <span>Final Salary</span>
                <span className="ap-final-box__amount">
                  {fmt(finalPreview)}
                </span>
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
      <CSVLink
        data={exportData()}
        filename="export.csv"
        ref={csvRef}
        style={{ display: "none" }}
      />
    </div>
  );
}
