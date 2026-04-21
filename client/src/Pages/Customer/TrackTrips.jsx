import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "../../Styles/TrackTrip.css";
import API_BASE_URL from "../../config/api";
import { Skeleton } from "@mui/material";
import { PacmanLoader } from "react-spinners";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";

function TrackTrip() {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/trip/latest`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setTrip(data);
        }
      } catch (err) {
        setSnackbar((p) => ({
          ...p,
          open: true,
          message: err.message,
          severity: "error",
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  const getCoordinates = async (place) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${place}&format=json`,
        {
          headers: {
            "User-Agent": "MyTripApp/1.0",
          },
        },
      );

      const data = await res.json();

      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }

      return null;
    } catch (err) {
      setSnackbar((p) => ({
        ...p,
        open: true,
        message: err.message,
        severity: "error",
      }));
      return null;
    }
  };

  useEffect(() => {
    if (!trip) return;

    let map;

    const loadMap = async () => {
      const pickupCoords = await getCoordinates(
        `${trip.pickupCity}, ${trip.pickupState}, India`,
      );

      const destCoords = await getCoordinates(
        `${trip.destinationCity}, ${trip.destinationState}, India`,
      );

      if (!pickupCoords || !destCoords) {
        setSnackbar((p) => ({
          ...p,
          open: true,
          message: "Coordinates not found",
          severity: "error",
        }));
        return;
      }

      map = L.map("map").setView(pickupCoords, 7);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      L.Routing.control({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        waypoints: [
          L.latLng(pickupCoords[0], pickupCoords[1]),
          L.latLng(destCoords[0], destCoords[1]),
        ],
        routeWhileDragging: false,
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
      })
        .on("routesfound", function (e) {
          const route = e.routes[0];

          const distKm = (route.summary.totalDistance / 1000).toFixed(2);
          const timeMin = Math.round(route.summary.totalTime / 60);

          const hours = Math.floor(timeMin / 60);
          const minutes = timeMin % 60;

          setDistance(distKm + " km");
          setDuration(`${hours} hr ${minutes} min`);

          const bounds = L.latLngBounds([pickupCoords, destCoords]);

          map.fitBounds(bounds, {
            padding: [80, 80],
            animate: true,
          });
        })
        .addTo(map);
    };

    loadMap();

    return () => {
      if (map) map.remove();
    };
  }, [trip]);

  if (loading) {
    return (
      <div className="loading-customerdashboard">
        <PacmanLoader color="#1e40af" size={25} />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="track-page">
        <h2>No Trip Found</h2>
      </div>
    );
  }

  return (
    <div className="track-page">
      <h1>Track My Trip</h1>

      <div className="trip-info-card">
        <div className="trip-row">
          <span>From:</span>
          <strong>{trip.pickupCity}</strong>
        </div>

        <div className="trip-row">
          <span>To:</span>
          <strong>{trip.destinationCity}</strong>
        </div>

        <div className="trip-row">
          <span>Distance:</span>
          <strong>
            {distance || (
              <Skeleton
                sx={{ borderRadius: "10px" }}
                variant="rectangular"
                height={20}
                width={150}
              />
            )}
          </strong>
        </div>

        <div className="trip-row">
          <span>Estimated Time:</span>
          <strong>
            {duration || (
              <Skeleton
                sx={{ borderRadius: "10px" }}
                variant="rectangular"
                height={20}
                width={150}
              />
            )}
          </strong>
        </div>

        <div className="trip-row">
          <span>Status:</span>
          <strong className="driver-status">Driver On The Way 🚗</strong>
        </div>
      </div>

      <div id="map" className="map-container"></div>
      <CustomizedSnackbars
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}

export default TrackTrip;
