import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

export default function TripMap({ Coords }) {

  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (!Coords) return;

    const getRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${Coords.source.lon},${Coords.source.lat};${Coords.destination.lon},${Coords.destination.lat}?overview=full&geometries=geojson`
        );

        const data = await res.json();

        const coordinates = data.routes[0].geometry.coordinates.map(
          coord => [coord[1], coord[0]]
        );

        setRoute(coordinates);

      } catch (err) {
        console.error("Route fetch error:", err);
      }
    };

    getRoute();

  }, [Coords]);

  // 🛑 Prevent crash
  if (!Coords) return <p>Map Loading...</p>;

  const sourcePos = [
    parseFloat(Coords.source.lat),
    parseFloat(Coords.source.lon)
  ];

  const destPos = [
    parseFloat(Coords.destination.lat),
    parseFloat(Coords.destination.lon)
  ];

  return (
    <MapContainer
      center={sourcePos}
      zoom={12}
      style={{ height: "400px", width: "100%", borderRadius: "10px" }}
    >

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={sourcePos}>
        <Popup>Source</Popup>
      </Marker>

      <Marker position={destPos}>
        <Popup>Destination</Popup>
      </Marker>

      {route.length > 0 && (
        <>
          <Polyline
            positions={route}
            pathOptions={{ color: "#3b82f6", weight: 5 }}
          />
          <FitRoute route={route} />
        </>
      )}

    </MapContainer>
  );
}

function FitRoute({ route }) {
  const map = useMap();

  useEffect(() => {
    if (!route || route.length === 0) return;

    const bounds = L.latLngBounds(route);
        map.flyToBounds(bounds, {
            padding: [40, 40],
            duration: 1.5
          });

  }, [route, map]);

  return null;
}