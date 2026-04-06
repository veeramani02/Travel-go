import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/MyTrips.css";

function MyTrips() {
  const navigate = useNavigate();

  const [currentTrip, setCurrentTrip] = useState(null);
  const [pastTrips, setPastTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        //  CURRENT TRIP
        const latestRes = await fetch(
          "http://localhost:3000/api/trip/latest",
          {
            credentials: "include",
          }
        );

        const latestData = await latestRes.json();

        console.log("Latest Trip:", latestData); 

        if (latestRes.ok && latestData) {
          setCurrentTrip(latestData); 
        }

        //  PAST TRIPS
        const pastRes = await fetch(
          "http://localhost:3000/api/trip/past-trips",
          {
            credentials: "include",
          }
        );

        const pastData = await pastRes.json();

        if (pastRes.ok) {
          setPastTrips(pastData);
        }

      } catch (err) {
        console.error("Fetch Trips Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) return <h2>Loading trips...</h2>;

  return (
    <div className="mytrips-page">
      <h1 className="mytrips-title">My Trips</h1>

      {/*  CURRENT TRIP */}
      {currentTrip && (
        <div className="current-trip-section">
          <h2>Current Trip</h2>

          <div className="trip-card highlight">
            <div className="trip-header">
              <span className="route">
                {currentTrip.pickupCity} ({currentTrip.pickupState}) →{" "}
                {currentTrip.destinationCity} ({currentTrip.destinationState})
              </span>

              <span className="status active-status">
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
            </div>

           
            <button
              className="track-btn"
              onClick={() =>
                navigate(`/customer/track/${currentTrip._id}`, {
                  state: {
                    pickupCoords: currentTrip.pickupCoordinates,
                    destinationCoords: currentTrip.destinationCoordinates,
                  },
                })
              }
            >
              Track My Trip
            </button>
          </div>
        </div>
      )}

      {/*  PAST TRIPS */}
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
    </div>
  );
}

export default MyTrips;

