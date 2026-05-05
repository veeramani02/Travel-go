import React, { useState, useEffect } from "react";
import CarImage from "../../assets/drivercar.png";
import MoneyImage from "../../assets/money.png";
import FlagImage from "../../assets/flag.svg";
import "../../Styles/DriverDashboard.css";
import API_BASE_URL from "../../config/api";
import { FaCar } from "react-icons/fa";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { FaFlagCheckered } from "react-icons/fa";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";
import AlertDialogSlide from "../../Components/AlertDialogSlide";
import { TripsData } from "../../services/customerService";

export default function Driver() {
  const [status, setStatus] = useState("offline");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    message: "",
    title: "",
    confirmText: "",
  });
  const [pendingAction, setPendingAction] = useState(null);
  const [driver, setDriver] = useState([]);
  const [trips, setTrips] = useState([]);
  const today = new Date().toISOString().slice(0, 10);
  const [completedTrips, setCompletedTrips] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, trip] = await Promise.all([
          fetch(`${API_BASE_URL}/api/driver/me`, {
            credentials: "include",
          }),
          TripsData(),
        ]);

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setDriver(data);

        setTrips(trip.filter((v) => v.driverId === data._id));
        setCompletedTrips(
          trip.filter((v) => v.status.toLowerCase().trim() === "completed"),
        );
        setStatus(data.status);
      } catch (err) {
        console.error("Fetch error:", err.message);
      }
    };
    fetchData();
  }, []);

  const goOnline = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/driver/online`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      setSnackbar({
        open: true,
        message: "You are going Online ✅",
        severity: "success",
      });
      setStatus(data.driver.status);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };
  const goOffline = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/driver/offline`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      setSnackbar({
        open: true,
        message: "You are going offline 🛑",
        severity: "success",
      });

      setStatus(data.driver.status);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  function handleStatus(type) {
    if (type === "ONLINE") {
      setPendingAction("ONLINE");
      setConfirmDialog({
        open: true,
        message: "Are you sure you want to Go Online?",
        title: "Go Online",
        confirmText: "Confirm",
      });
    }
    if (type === "OFFLINE") {
      setPendingAction("OFFLINE");
      setConfirmDialog({
        open: true,
        message: "Are you sure you want to Go Offline?",
        title: "Go Offline",
        confirmText: "Confirm",
      });
    }
  }

  const handleConfirm = () => {
    if (pendingAction === "ONLINE") {
      goOnline();
    } else if (pendingAction === "OFFLINE") {
      goOffline();
    }
    setConfirmDialog((p) => ({ ...p, open: false }));
    setPendingAction(null);
  };

  return (
    <div className="driver-container">
      <div className="dc-title-button">
        <h1 className="driver-title">Driver Dashboard</h1>
        {status === "offline" ? (
          <button onClick={() => handleStatus("ONLINE")}>Go Online</button>
        ) : (
          <button onClick={() => handleStatus("OFFLINE")}>Go Offline</button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="driver-cards">
        <div className="driver-card dc-car-card">
          <div className="driver-circle dc-car">
            <FaCar />
          </div>
          <div className="driver-info">
            <p className="driver-label">Total Distance (Month)</p>
            <h2 className="driver-value">1,540 km</h2>
          </div>
        </div>

        <div className="driver-card dc-money-card">
          <div className="driver-circle dc-money">
            <RiMoneyRupeeCircleLine />
          </div>
          <div className="driver-info">
            <p className="driver-label">Money Earn (Month)</p>
            <h2 className="driver-value">{driver?.payroll?.paidAmount}</h2>
          </div>
        </div>

        <div className="driver-card dc-trip-card">
          <div className="driver-circle dc-trip">
            <FaFlagCheckered />
          </div>
          <div className="driver-info">
            <p className="driver-label">Trips Completed (Month)</p>
            <h2 className="driver-value">{completedTrips.length}</h2>
          </div>
        </div>
      </div>

      <div className="driver-table-section">
        <div className="driver-recent">
          <p className="driver-recent-title">Recent Trips</p>

          <div className="driver-table-wrapper">
            <table className="driver-table driver-recent-table">
              <thead>
                <tr>
                  <th>Trip Id</th>
                  <th>Date</th>
                  <th>Route</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {trips
                  .filter((v) => v.dateAndTime.slice(0, 10) <= today)
                  .map((v) => (
                    <tr key={v._id}>
                      <td>{v._id.slice(0, 4).toUpperCase()}</td>
                      <td>{v.dateAndTime.slice(0, 10)}</td>
                      <td>
                        {v.pickupCity} → {v.destinationCity}
                      </td>
                      <td>{v.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="driver-upcoming">
          <p className="driver-upcoming-title">Upcoming Assignments</p>

          <div className="driver-table-wrapper">
            <table className="driver-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Task</th>
                </tr>
              </thead>
              <tbody>
                {trips
                  .filter((v) => v.dateAndTime.slice(0, 10) > today)
                  .map((v) => (
                    <tr key={v._id}>
                      <td>{v.dateAndTime.slice(0, 10)}</td>
                      <td>
                        {v.pickupCity} → {v.destinationCity}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CustomizedSnackbars
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      />
      <AlertDialogSlide
        open={confirmDialog.open}
        message={confirmDialog.message}
        title={confirmDialog.title}
        confirmText={confirmDialog.confirmText}
        onClose={() => setConfirmDialog((p) => ({ ...p, open: false }))}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
