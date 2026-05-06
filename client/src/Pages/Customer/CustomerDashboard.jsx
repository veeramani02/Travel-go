import { useEffect, useState } from "react";
import "../../Styles/CustomerDashboard.css";
import ooty from "../../assets/ooty.jpg";
import kodaikanal from "../../assets/kodaikanal.jpg";
import mahabalipuram from "../../assets/mahabalipuram.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { IoCarOutline } from "react-icons/io5";
import { LuCalendarDays } from "react-icons/lu";
import { FaRegStar } from "react-icons/fa6";
import { LuCalendarClock } from "react-icons/lu";
import API_BASE_URL from "../../config/api";
import { PacmanLoader } from "react-spinners";

function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/dashboard/customer`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await res.json();
        setDashboard(data);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const formatDateOnly = (dateStr) => {
    if (!dateStr) return "No Date";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };
  if (loading) {
    return (
      <div className="loading-customerdashboard">
        <PacmanLoader color="#1e40af" size={25} />
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
        Error: {error}
      </div>
    );
  }
  return (
    <div>
      <main>
        <section className="dashboard-header">
          <p className="welcome-text">
            Welcome back, {user?.name || user?.username || "User"} 👋
          </p>
          <div className="primary-button">
            <button onClick={() => navigate("/customer/book-trip")}>
              Book New Trip
            </button>
          </div>
        </section>
        <section>
          <div className="card-wrapper">
            <div
              className="card1"
              onClick={() => navigate("/customer/my-trips")}
            >
              <div className="card-content">
                <div>
                  <LuCalendarDays className="card-icon card1-icon" />
                </div>
                <div>
                  <p className="card-main">Upcoming Trip</p>
                  <p className="card-sub">
                    {dashboard?.upcomingTrip
                      ? `${dashboard.upcomingTrip.from} → ${dashboard.upcomingTrip.to}`
                      : "No upcoming trip"}
                  </p>
                </div>
              </div>
            </div>
            <div className="card2">
              <div className="card-content">
                <div>
                  <IoCarOutline className="card-icon card2-icon" />
                </div>
                <div>
                  <p className="card-main">Total Trips</p>
                  <p className="card-sub">{dashboard?.totalTrips ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="card3">
              <div className="card-content">
                <div>
                  <FaRegStar className="card-icon card3-icon" />
                </div>
                <div>
                  <p className="card-main">Loyalty Points</p>
                  <p className="card-sub">{dashboard?.loyaltyPoints ?? 0}</p>
                </div>
              </div>
            </div>
            <div className="card4">
              <div className="card-content">
                <div>
                  <LuCalendarClock className="card-icon card4-icon" />
                </div>
                <div>
                  <p className="card-main">Pending Dues</p>
                  <p className="card-sub">₹{dashboard?.pendingAmount ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="upcoming-section">
          <h2>Upcoming Trip</h2>
          {dashboard?.upcomingTrip ? (
            <div className="upcoming-card">
              <div className="upcoming-left">
                <div className="row">
                  <span className="label">From:</span>
                  <span className="value">{dashboard.upcomingTrip.from}</span>
                </div>

                <div className="row">
                  <span className="label">To:</span>
                  <span className="value">{dashboard.upcomingTrip.to}</span>
                </div>

                <div className="row">
                  <span className="label">Status:</span>
                  <span className="status-badge">
                    {dashboard.upcomingTrip.status || "Pending"}
                  </span>
                </div>
              </div>

              <div className="upcoming-right">
                <div className="row">
                  <span className="label">Date:</span>
                  <span className="value">
                    {formatDate(dashboard.upcomingTrip.startDate)}
                  </span>
                </div>

                <div className="row">
                  <span className="label">Vehicle:</span>
                  <span className="value">
                    {dashboard.upcomingTrip.vehicle || "-"}
                  </span>
                </div>

                <div className="row">
                  <span className="label">Passengers:</span>
                  <span className="value">
                    {dashboard.upcomingTrip.passengers || "-"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="upcoming-card"
              style={{ textAlign: "center", padding: "20px" }}
            >
              <p>
                No upcoming trips.{" "}
                <span
                  style={{ color: "#007bff", cursor: "pointer" }}
                  onClick={() => navigate("/customer/book-trip")}
                >
                  Book one now!
                </span>
              </p>
            </div>
          )}
        </div>
        <div className="bottom-section">
          <div className="trip-history">
            <h2>Recent Trip History</h2>
            <div className="history-card">
              <table className="customer-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Route</th>
                    <th>Vehicle</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard?.lastTrips?.length > 0 ? (
                    dashboard.lastTrips.map((trip) => (
                      <tr key={trip._id}>
                        <td>{formatDateOnly(trip.startDate)}</td>
                        <td>
                          {trip.from} → {trip.to}
                        </td>
                        <td>{trip.vehicle || "-"}</td>
                        <td>₹{trip.price ?? 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        style={{ textAlign: "center", padding: "16px" }}
                      >
                        No past trips found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="popular-section">
            <h2>Most Popular Destinations</h2>
            <div className="destination-wrapper">
              <div className="destination-card">
                <img src={ooty} alt="Ooty" />
                <h4>Ooty</h4>
                <button onClick={() => navigate("/customer/book-trip")}>
                  Try Now
                </button>
              </div>

              <div className="destination-card">
                <img src={kodaikanal} alt="Kodaikanal" />
                <h4>Kodaikanal</h4>
                <button onClick={() => navigate("/customer/book-trip")}>
                  Try Now
                </button>
              </div>

              <div className="destination-card">
                <img src={mahabalipuram} alt="Mahabalipuram" />
                <h4>Mahabalipuram</h4>
                <button onClick={() => navigate("/customer/book-trip")}>
                  Try Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CustomerDashboard;
