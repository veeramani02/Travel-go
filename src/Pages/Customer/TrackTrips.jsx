// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// // import L from "leaflet";
// // import "leaflet/dist/leaflet.css";
// // import "leaflet-routing-machine";

// // import "../../Styles/TrackTrip.css";

// // function TrackTrip() {
// //   const { id } = useParams();
// //   const [trip, setTrip] = useState(null);
// //   const [distance, setDistance] = useState("");
// //   const [duration, setDuration] = useState("");

// //   // Simple city coordinates map (Demo)
// //   const cityCoordinates = {
// //     Chennai: [13.0827, 80.2707],
// //     Madurai: [9.9252, 78.1198],
// //     Coimbatore: [11.0168, 76.9558],
// //     Trichy: [10.7905, 78.7047],
// //   };

// //   useEffect(() => {
// //     const trips = JSON.parse(localStorage.getItem("tripHistory")) || [];
// //     const selectedTrip = trips.find((t) => t.id === id);

// //     if (selectedTrip) {
// //       setTrip(selectedTrip);
// //     }
// //   }, [id]);

// //   useEffect(() => {
// //     if (!trip) return;

// //     const pickupCoords = cityCoordinates[trip.pickupCity];
// //     const destCoords = cityCoordinates[trip.destinationCity];

// //     if (!pickupCoords || !destCoords) return;

// //     const map = L.map("map").setView(pickupCoords, 7);

// //     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
// //       attribution: "© OpenStreetMap contributors",
// //     }).addTo(map);

// //     const routingControl = L.Routing.control({
// //       waypoints: [
// //         L.latLng(pickupCoords[0], pickupCoords[1]),
// //         L.latLng(destCoords[0], destCoords[1]),
// //       ],
// //       routeWhileDragging: false,
// //       show: false,
// //       addWaypoints: false,
// //     })
// //       .on("routesfound", function (e) {
// //         const route = e.routes[0];
// //         const distKm = (route.summary.totalDistance / 1000).toFixed(2);
// //         const timeMin = Math.round(route.summary.totalTime / 60);

// //         setDistance(distKm + " km");
// //         setDuration(timeMin + " mins");
// //       })
// //       .addTo(map);

// //     return () => {
// //       map.remove();
// //     };
// //   }, [trip]);

// //   if (!trip) {
// //     return (
// //       <div className="track-page">
// //         <h2>No Trip Found</h2>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="track-page">
// //       <h1>Track My Trip</h1>

// //       <div className="trip-info">
// //         <p><strong>From:</strong> {trip.pickupCity}</p>
// //         <p><strong>To:</strong> {trip.destinationCity}</p>
// //         <p><strong>Distance:</strong> {distance}</p>
// //         <p><strong>Estimated Time:</strong> {duration}</p>
// //         <p><strong>Status:</strong> Driver On The Way</p>
// //       </div>

// //       <div id="map" style={{ height: "400px", marginTop: "20px" }}></div>
// //     </div>
// //   );
// // }

// // export default TrackTrip;
// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine";
// import "../../Styles/TrackTrip.css";

// /* 🔥 Fix Marker Icon Issue */
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

// function Routing({ pickup, destination, setDistance, setDuration }) {
//   const map = useMap();

//   useEffect(() => {
//     if (!pickup || !destination) return;

//     const routingControl = L.Routing.control({
//       waypoints: [
//         L.latLng(pickup[0], pickup[1]),
//         L.latLng(destination[0], destination[1]),
//       ],
//       routeWhileDragging: false,
//       show: false,
//       addWaypoints: false,
//     })
//       .on("routesfound", function (e) {
//         const route = e.routes[0];
//         const distKm = (route.summary.totalDistance / 1000).toFixed(2);
//         const timeMin = Math.round(route.summary.totalTime / 60);

//         setDistance(distKm + " km");
//         setDuration(timeMin + " mins");
//       })
//       .addTo(map);

//     return () => map.removeControl(routingControl);
//   }, [pickup, destination, map, setDistance, setDuration]);

//   return null;
// }

// function TrackTrip() {
//   const { id } = useParams();
//   const [trip, setTrip] = useState(null);
//   const [distance, setDistance] = useState("");
//   const [duration, setDuration] = useState("");

//   const cityCoordinates = {
//     Chennai: [13.0827, 80.2707],
//     Madurai: [9.9252, 78.1198],
//     Coimbatore: [11.0168, 76.9558],
//     Trichy: [10.7905, 78.7047],
//   };

//   useEffect(() => {
//     const trips = JSON.parse(localStorage.getItem("tripHistory")) || [];
//     const selectedTrip = trips.find((t) => t.id === id);

//     if (selectedTrip) {
//       setTrip(selectedTrip);
//     }
//   }, [id]);

//   if (!trip) {
//     return (
//       <div className="track-page">
//         <h2>No Trip Found</h2>
//       </div>
//     );
//   }

//   const pickupCoords = cityCoordinates[trip.pickupCity];
//   const destCoords = cityCoordinates[trip.destinationCity];

//   if (!pickupCoords || !destCoords) {
//     return (
//       <div className="track-page">
//         <h2>City Coordinates Not Found</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="track-page">
//       <h1>Track My Trip</h1>

//       <div className="trip-info">
//         <p><strong>From:</strong> {trip.pickupCity}</p>
//         <p><strong>To:</strong> {trip.destinationCity}</p>
//         <p><strong>Distance:</strong> {distance}</p>
//         <p><strong>Estimated Time:</strong> {duration}</p>
//         <p><strong>Status:</strong> {trip.status}</p>
//       </div>

//       <MapContainer
//         center={pickupCoords}
//         zoom={7}
//         style={{ height: "400px", width: "100%", marginTop: "20px" }}
//       >
//         <TileLayer
//           attribution="© OpenStreetMap contributors"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         <Marker position={pickupCoords}>
//           <Popup>Pickup Location</Popup>
//         </Marker>

//         <Marker position={destCoords}>
//           <Popup>Destination</Popup>
//         </Marker>

//         <Routing
//           pickup={pickupCoords}
//           destination={destCoords}
//           setDistance={setDistance}
//           setDuration={setDuration}
//         />
//       </MapContainer>
//     </div>
//   );
// }

// export default TrackTrip;


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

  /* ===============================
     UI
  =================================*/
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