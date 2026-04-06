import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";
import { Skeleton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export default function TripMap({ Coords }) {
  const [route, setRoute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!Coords?.source?.lat || !Coords?.destination?.lat) return;
    setLoading(true);
    setSnackbar((prev) => ({
      ...prev,
      open: true,
      message: "Fetching route...",
      severity: "info",
    }));
    setRoute([]);
    const getRoute = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/trip/route?start=${Coords.source.lon},${Coords.source.lat}&end=${Coords.destination.lon},${Coords.destination.lat}`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();

        if (!data.routes || data.routes.length === 0) {
          console.error("No route found");
          return;
        }

        const coordinates = data.routes[0].geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);

        setRoute(coordinates);
        setSnackbar({
          open: true,
          message: "Route loaded successfully",
          severity: "success",
        });
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Route fetch error",
          severity: "error",
        });
        console.error("Route fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    getRoute();
  }, [Coords]);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const loadingStyle = {
    height: "400px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  //  Prevent crash
  if (!Coords)
    return (
      <div style={loadingStyle}>
        <CircularProgress />
      </div>
    );

  const sourcePos = [Number(Coords?.source?.lat), Number(Coords?.source?.lon)];

  const destPos = [
    Number(Coords?.destination?.lat),
    Number(Coords?.destination?.lon),
  ];

  if (sourcePos.includes(NaN) || destPos.includes(NaN)) {
    return <p>Invalid coordinates</p>;
  }
  return (
    <>
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.grey[300],
            borderRadius: "10px",
          }}
        />
      ) : (
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
      )}
      <CustomizedSnackbars
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </>
  );
}

function FitRoute({ route }) {
  const map = useMap();

  useEffect(() => {
    if (!route || route.length === 0) return;

    const bounds = L.latLngBounds(route);
    map.flyToBounds(bounds, {
      padding: [40, 40],
      duration: 1.5,
    });
  }, [route, map]);

  return null;
}
