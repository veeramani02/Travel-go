
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/MyTrips.css";

function MyTrips() {
  const navigate = useNavigate();

  const [currentTrip, setCurrentTrip] = useState(null);
  const [pastTrips, setPastTrips] = useState([]);

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem("tripHistory")) || [];

    if (trips.length > 0) {
      const sortedTrips = [...trips].reverse();

      const latestTrip = sortedTrips[0];

      // Active trip logic
      if (
        latestTrip.status === "Assigned" ||
        latestTrip.status === "Booked"
      ) {
        setCurrentTrip(latestTrip);
        setPastTrips(sortedTrips.slice(1));
      } else {
        setPastTrips(sortedTrips);
      }
    }
  }, []);

  return (
    <div className="mytrips-page">
      <h1 className="mytrips-title">My Trips</h1>

      {/* ================= CURRENT TRIP ================= */}
      {currentTrip && (
        <div className="current-trip-section">
          <h2>Current Trip</h2>

          <div className="trip-card highlight">
            <div className="trip-header">
              <span className="route">
                {currentTrip.pickupCity} ({currentTrip.pickupState}) →{" "}
                {currentTrip.destinationCity} ({currentTrip.destinationState})
              </span>

              <span className={`status active-status`}>
                {currentTrip.status}
              </span>
            </div>

            <div className="trip-details">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(currentTrip.travelDate).toLocaleString()}
              </p>
              <p>
                <strong>Passengers:</strong> {currentTrip.passengers}
              </p>
              <p>
                <strong>Vehicle:</strong> {currentTrip.vehicleType}
              </p>
              <p>
                <strong>Payment:</strong> {currentTrip.paymentMethod}
              </p>
            </div>

            {/* ✅ TRACK BUTTON */}
            {(currentTrip.status === "Assigned" ||
              currentTrip.status === "Booked") && (
              <button
                className="track-btn"
                onClick={() =>
                  navigate(`/customer/track/${currentTrip.id}`)
                }
              >
                Track My Trip
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= PAST TRIPS ================= */}
      <div className="past-trips-section">
        <h2>Past Trips</h2>

        {pastTrips.length === 0 ? (
          <div className="no-trip-card">
            <p>No past trips available.</p>
          </div>
        ) : (
          <div className="trips-wrapper">
            {pastTrips.map((trip, index) => (
              <div className="trip-card" key={trip.id || index}>
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
                    {new Date(trip.travelDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>Passengers:</strong> {trip.passengers}
                  </p>
                  <p>
                    <strong>Vehicle:</strong> {trip.vehicleType}
                  </p>
                  <p>
                    <strong>Payment:</strong> {trip.paymentMethod}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrips;

