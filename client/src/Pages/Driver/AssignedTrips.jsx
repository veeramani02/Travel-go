import React, { useState, useEffect } from "react";
import "../../Styles/Assignedtrips.css";
import TripMap from "../Admin/TripMap";
import API_BASE_URL from "../../config/api";
import { PacmanLoader } from "react-spinners";

function AssignedTrips() {
  const [coords, setCoords] = useState(null);
  const [openMap, setOpenMap] = useState(false);
  const [assignedTrip, setAssignedTrip] = useState(null);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [loadingMap, setLoadingMap] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/driver/my-trips`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch trips");
        }

        const data = await res.json();

        console.log("DRIVER TRIPS:", data);

        const activeTrip = data.find(
          (trip) =>
            trip.status?.toLowerCase() === "assigned" ||
            trip.status?.toLowerCase() === "current",
        );

        const completed = data.filter(
          (trip) => trip.status?.toLowerCase() === "completed",
        );

        setAssignedTrip(activeTrip || null);
        setCompletedTrips(completed);
      } catch (error) {
        console.error("Trip fetch error:", error);
      }
    };

    fetchTrips();
  }, [API_BASE_URL]);

  const getCoordinates = async (value) => {
    try {
      setLoadingMap(true);
      const sourceUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value.source)}`;
      const destinationUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value.destination)}`;

      const [sourceRes, destinationRes] = await Promise.all([
        fetch(sourceUrl, {
          headers: {
            Accept: "application/json",
            "User-Agent": "your-app-name",
          },
        }),
        fetch(destinationUrl, {
          headers: {
            Accept: "application/json",
            "User-Agent": "your-app-name",
          },
        }),
      ]);

      const sourceData = await sourceRes.json();
      const destinationData = await destinationRes.json();

      if (sourceData.length > 0 && destinationData.length > 0) {
        setCoords({
          source: {
            lat: parseFloat(sourceData[0].lat),
            lon: parseFloat(sourceData[0].lon),
          },
          destination: {
            lat: parseFloat(destinationData[0].lat),
            lon: parseFloat(destinationData[0].lon),
          },
        });

        setOpenMap(true);
        setLoadingMap(false);
      } else {
        console.log("Location not found");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setLoadingMap(false);
    }
  };

  const handleViewRoute = () => {
    if (!assignedTrip) return;
    getCoordinates({
      source: assignedTrip.pickupCity,
      destination: assignedTrip.destinationCity,
    });
  };

  return (
    <div className="at-container">
      {openMap ? (
        <div className="assigned-map-container">
          <h1 className="assigned-map-title">Map View</h1>

          {coords && <TripMap Coords={coords} />}

          <div className="assigned-map-button">
            <button
              onClick={() => {
                setOpenMap(false);
                setCoords(null);
              }}
            >
              ← Back To Main
            </button>
          </div>
        </div>
      ) : (
        <div className="driver-assigned-section">
          <h2 className="driver-section-title">Assigned Trip</h2>

          {assignedTrip ? (
            <div className="driver-assigned-card">
              <div className="driver-assigned-info">
                <p>
                  <strong>Trip ID:</strong> {assignedTrip._id}
                </p>
                <p>
                  <strong>Pickup:</strong> {assignedTrip.pickupCity}
                </p>
                <p>
                  <strong>Destination:</strong> {assignedTrip.destinationCity}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(assignedTrip.dateAndTime).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong> {assignedTrip.status}
                </p>
              </div>

              <div className="driver-assigned-actions">
                <button
                  className="driver-route-btn"
                  onClick={() => handleViewRoute()}
                >
                  View Route
                </button>
              </div>
            </div>
          ) : (
            <p>No Assigned Trips</p>
          )}

          <div className="driver-completed-section">
            <h2 className="driver-section-title">Completed Trips</h2>

            <div className="driver-table-wrapper">
              <table className="driver-table driver-completed-table">
                <thead>
                  <tr>
                    <th>Trip ID</th>
                    <th>Date</th>
                    <th>Route</th>
                    <th>Earnings</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {completedTrips.length > 0 ? (
                    completedTrips.map((trip) => (
                      <tr key={trip._id}>
                        <td>{trip._id}</td>
                        <td>
                          {new Date(trip.dateAndTime).toLocaleDateString()}
                        </td>
                        <td>
                          {trip.pickupCity} → {trip.destinationCity}
                        </td>
                        <td>{trip.amount || 0}</td>
                        <td>
                          <span className="status-pill completed">
                            {trip.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No Completed Trips</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {loadingMap && (
        <div className="at-loading">
          <PacmanLoader color="#1e40af" size={25} />
        </div>
      )}
    </div>
  );
}

export default AssignedTrips;
