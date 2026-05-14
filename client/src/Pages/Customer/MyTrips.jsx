import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/MyTrips.css";
import API_BASE_URL from "../../config/api";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";
import { PacmanLoader } from "react-spinners";

function MyTrips() {
  const navigate = useNavigate();

  const [currentTrip, setCurrentTrip] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const latestRes = await fetch(`${API_BASE_URL}/api/trip/upcoming`, {
        credentials: "include",
      });

      const latestData = await latestRes.json();
      console.log(latestData);
      if (latestRes.ok && latestData) {
        const today = new Date().toISOString().split("T")[0];
        setCurrentTrip(
          latestData.filter((v) => {
            const tripDate = new Date(v.dateAndTime)
              .toISOString()
              .split("T")[0];
            return tripDate === today;
          }),
        );
        setUpcomingTrips(
          latestData.filter((v) => {
            const tripDate = new Date(v.dateAndTime)
              .toISOString()
              .split("T")[0];
            return tripDate > today;
          }),
        );
      } else {
        setCurrentTrip(null);
      }

      const pastRes = await fetch(`${API_BASE_URL}/api/trip/past-trips`, {
        credentials: "include",
      });

      const pastData = await pastRes.json();

      if (pastRes.ok) {
        setPastTrips(pastData);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTrip = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/trip/cancel/${id}`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel trip");
      }

      setCurrentTrip(data.trip);

      setSnackbar({
        open: true,
        message: data.message,
        severity: "success",
      });

      fetchTrips();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  const getTripTimerLabel = (trip) => {
    if (trip.status === "cancelled") return "Trip Cancelled";

    if (trip.status === "completed") return "Trip Completed";

    if (trip.status === "current") return "Trip in Progress";

    if (trip.status === "pending") return "Pending Assignment";

    if (trip.status === "confirmed") return "Payment Confirmed";

    if (trip.estimatedDuration != null && trip.estimatedDuration > 0) {
      const hrs = Math.floor(trip.estimatedDuration);
      const mins = Math.round((trip.estimatedDuration - hrs) * 60);

      if (hrs > 0 && mins > 0) return `~${hrs}h ${mins}m estimated`;
      if (hrs > 0) return `~${hrs}h estimated`;

      return `~${mins}m estimated`;
    }

    return "Route ETA unavailable";
  };
  if (loading)
    return (
      <div className="loading-customerdashboard">
        <PacmanLoader color="#1e40af" size={25} />
      </div>
    );

  return (
    <div className="mytrips-page">
      <h1 className="mytrips-title">My Trips</h1>

      {currentTrip.length !== 0 ? (
        <div className="current-trip-section">
          <h2>Current Trip</h2>

          {currentTrip.map((trip) => (
            <div className="trip-card highlight" key={trip._id}>
              <div className="trip-header">
                <span className="route">
                  {trip.pickupCity} ({trip.pickupState}) →{" "}
                  {trip.destinationCity} ({trip.destinationState})
                </span>

                <span
                  className={`status ${
                    trip.status === "cancelled"
                      ? "cancelled-status"
                      : trip.status === "completed"
                        ? "completed-status"
                        : "active-status"
                  }`}
                >
                  {trip.status}
                </span>
              </div>

              <div className="trip-details">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(trip.dateAndTime).toLocaleString()}
                </p>

                <p>
                  <strong>Passengers:</strong> {trip.passengers}
                </p>

                <p>
                  <strong>Vehicle:</strong> {trip.vehicleType}
                </p>

                <p>
                  <strong>Trip Timer:</strong>{" "}
                  {trip.status === "cancelled"
                    ? "Trip Cancelled"
                    : trip.status === "completed"
                      ? "Trip Completed"
                      : trip.status === "current"
                        ? "Trip in Progress"
                        : `${trip.estimatedDuration?.toFixed(1)} hrs`}
                </p>
              </div>

              <div className="trip-btn-group">
                {trip.status !== "cancelled" && trip.status !== "completed" && (
                  <div className="mt-button">
                    <button
                      className="track-btn"
                      onClick={() =>
                        navigate(`/customer/track/${trip._id}`, {
                          state: {
                            pickupCoords: trip.pickupCoordinates,
                            destinationCoords: trip.destinationCoordinates,
                          },
                        })
                      }
                    >
                      Track My Trip
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelTrip(trip._id)}
                    >
                      Cancel Trip
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <div>
            <h2 style={{ marginBottom: "20px" }}>Current Trips</h2>
            <div className="mt-upcoming-empty">
              <h3>"No Current Trips"</h3>
            </div>
          </div>
        </div>
      )}

      {upcomingTrips.length !== 0 ? (
        <div className="mt-upcoming-items">
          <h2>Upcoming Trip</h2>
          {upcomingTrips.map((v) => (
            <div className="mt-upcoming-item">
              <div className="mt-upcoming-d-s">
                <div>
                  <span className="route">
                    {v.pickupCity} ({v.pickupState}) → {v.destinationCity} (
                    {v.destinationState})
                  </span>
                </div>
                <div>
                  <span
                    className={`status ${
                      v.status === "cancelled"
                        ? "cancelled-status"
                        : currentTrip.status === "completed"
                          ? "completed-status"
                          : "active-status"
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
              </div>
              <div className="trip-details">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(v.dateAndTime).toLocaleString()}
                </p>

                <p>
                  <strong>Passengers:</strong> {v.passengers}
                </p>

                <p>
                  <strong>Vehicle:</strong> {v.vehicleType}
                </p>

                <p>
                  <strong>Trip Timer:</strong>{" "}
                  {v.status === "cancelled"
                    ? "Trip Cancelled"
                    : v.status === "completed"
                      ? "Trip Completed"
                      : v.status === "current"
                        ? "Trip in Progress"
                        : `${v.estimatedDuration?.toFixed(1)} hrs`}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2 style={{ marginBottom: "20px" }}>Upcoming Trip</h2>
          <div className="mt-upcoming-empty">
            <h3>"No Upcoming Trips"</h3>
          </div>
        </div>
      )}

      {/* PAST TRIPS */}
      <div className="past-trips-section">
        <h2>Past Trips</h2>

        {pastTrips.length === 0 ? (
          <div className="mt-upcoming-empty">
            <h3>"No past trips available"</h3>
          </div>
        ) : (
          <div className="trips-wrapper">
            {pastTrips.map((trip) => (
              <div className="trip-card" key={trip._id}>
                <div className="trip-header">
                  <span className="route">
                    {trip.pickupCity} ({trip.pickupState}) →{" "}
                    {trip.destinationCity} ({trip.destinationState})
                  </span>

                  <span className="status">{trip.status}</span>
                </div>

                <div className="trip-details">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(trip.dateAndTime).toLocaleString()}
                  </p>

                  <p>
                    <strong>Passengers:</strong> {trip.passengers}
                  </p>

                  <p>
                    <strong>Vehicle:</strong> {trip.vehicleType}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CustomizedSnackbars
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </div>
  );
}

export default MyTrips;
