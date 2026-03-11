import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "../../Styles/TrackTrip.css";

function TrackTrip() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);

  /* ===============================
     GET TRIP FROM LOCAL STORAGE
  =================================*/
  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem("tripHistory")) || [];
    const selectedTrip = trips.find((t) => t.id === id);

    if (selectedTrip) {
      setTrip(selectedTrip);
    }

    setLoading(false);
  }, [id]);

  /* ===============================
     GET LAT/LNG FROM CITY NAME
  =================================*/
  const getCoordinates = async (city) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${city}&format=json`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  /* ===============================
     LOAD MAP + ROUTE
  =================================*/
  useEffect(() => {
    if (!trip) return;

    let map;

    const loadMap = async () => {
      const pickupCoords = await getCoordinates(trip.pickupCity);
      const destCoords = await getCoordinates(trip.destinationCity);

      if (!pickupCoords || !destCoords) {
        console.error("Coordinates not found");
        return;
      }

      map = L.map("map").setView(pickupCoords, 7);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      L.Routing.control({
        waypoints: [
          L.latLng(pickupCoords[0], pickupCoords[1]),
          L.latLng(destCoords[0], destCoords[1]),
        ],
        routeWhileDragging: false,
        show: false,
        addWaypoints: false,
      })
        .on("routesfound", function (e) {
          const route = e.routes[0];

          const distKm = (route.summary.totalDistance / 1000).toFixed(2);
          const timeMin = Math.round(route.summary.totalTime / 60);

          const hours = Math.floor(timeMin / 60);
          const minutes = timeMin % 60;

          setDistance(distKm + " km");
          setDuration(`${hours} hr ${minutes} min`);
        })
        .addTo(map);
    };

    loadMap();

    return () => {
      if (map) map.remove();
    };
  }, [trip]);

  /* ===============================
     LOADING
  =================================*/
  if (loading) {
    return (
      <div className="track-page">
        <h2>Loading Trip...</h2>
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
          <strong>{distance || "Calculating..."}</strong>
        </div>

        <div className="trip-row">
          <span>Estimated Time:</span>
          <strong>{duration || "Calculating..."}</strong>
        </div>

        <div className="trip-row">
          <span>Status:</span>
          <strong className="driver-status">
            Driver On The Way 🚗
          </strong>
        </div>
      </div>

      <div id="map" className="map-container"></div>
    </div>
  );
}

export default TrackTrip;