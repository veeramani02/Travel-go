import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

export default function TripMap({ Coords }) {

  let sourcePos = [10.8155, 78.6965];
  let destPos = null;

  if (Coords) {
    if (Coords) {
    sourcePos = [
      parseFloat(Coords.source.lat),
      parseFloat(Coords.source.lon)
    ];

    destPos = [
      parseFloat(Coords.destination.lat),
      parseFloat(Coords.destination.lon)
    ];
  }
  }

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

      {destPos && (
        <Marker position={destPos}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      <Route coords={Coords} />

    </MapContainer>
  );
}

function Route({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (!coords) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(coords.source.lat, coords.source.lon),
        L.latLng(coords.destination.lat, coords.destination.lon)
      ],
      lineOptions: {
        styles: [{ color: "blue", weight: 5 }]
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true   
    }).addTo(map);

    return () => map.removeControl(routingControl);

  }, [coords, map]);

  return null;
}