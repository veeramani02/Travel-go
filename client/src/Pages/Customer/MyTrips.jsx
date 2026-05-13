import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/MyTrips.css";
import API_BASE_URL from "../../config/api";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";
import { PacmanLoader } from "react-spinners";

function MyTrips() {
  const navigate = useNavigate();

  const [currentTrip, setCurrentTrip] = useState(null);
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
      const latestRes = await fetch(`${API_BASE_URL}/api/trip/latest`, {
        credentials: "include",
      });

      const latestData = await latestRes.json();

      if (latestRes.ok && latestData) {
        setCurrentTrip(latestData);
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

  const handleCancelTrip = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/trip/cancel/${currentTrip._id}`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

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

      {currentTrip && (
        <div className="current-trip-section">
          <h2>Current Trip</h2>

          <div className="trip-card highlight">
            <div className="trip-header">
              <span className="route">
                {currentTrip.pickupCity} ({currentTrip.pickupState}) →{" "}
                {currentTrip.destinationCity} ({currentTrip.destinationState})
              </span>

              <span
                className={`status ${
                  currentTrip.status === "cancelled"
                    ? "cancelled-status"
                    : currentTrip.status === "completed"
                      ? "completed-status"
                      : "active-status"
                }`}
              >
                {currentTrip.status}
              </span>
            </div>

            <div className="trip-details">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(currentTrip.dateAndTime).toLocaleString()}
              </p>

              <p>
                <strong>Passengers:</strong> {currentTrip.passengers}
              </p>

              <p>
                <strong>Vehicle:</strong> {currentTrip.vehicleType}
              </p>

              <p>
                <strong>Trip Timer:</strong>{" "}
                {currentTrip.status === "cancelled"
                  ? "Trip Cancelled"
                  : currentTrip.status === "completed"
                    ? "Trip Completed"
                    : currentTrip.status === "current"
                      ? "Trip in Progress"
                      : `${currentTrip.estimatedDuration?.toFixed(1)} hrs`}
              </p>
            </div>

            <div className="trip-btn-group">
              {currentTrip.status !== "cancelled" &&
                currentTrip.status !== "completed" && (
                  <div className="mt-button">
                    <button
                      className="track-btn"
                      onClick={() =>
                        navigate(`/customer/track/${currentTrip._id}`, {
                          state: {
                            pickupCoords: currentTrip.pickupCoordinates,
                            destinationCoords:
                              currentTrip.destinationCoordinates,
                          },
                        })
                      }
                    >
                      Track My Trip
                    </button>

                    <button className="cancel-btn" onClick={handleCancelTrip}>
                      Cancel Trip
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* PAST TRIPS */}
      <div className="past-trips-section">
        <h2>Past Trips</h2>

        {pastTrips.length === 0 ? (
          <div className="no-trip-card">
            <p>No past trips available.</p>
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
