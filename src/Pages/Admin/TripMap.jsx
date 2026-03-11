import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function TripMap() {

  const position = [10.8155, 78.6965];

  return (
    <MapContainer center={position} zoom={12} style={{height:"400px", width:"100%", borderRadius:"10px"}}>
      
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>
          Vehicle Location
        </Popup>
      </Marker>

    </MapContainer>
  );
}