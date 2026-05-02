// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../Styles/MyTrips.css";
// import API_BASE_URL from "../../config/api";
// import CustomizedSnackbars from "../../Components/CustomizedSnackbars";
// import { PacmanLoader } from "react-spinners";


// function MyTrips() {
//   const navigate = useNavigate();

//   const [currentTrip, setCurrentTrip] = useState(null);
//   const [pastTrips, setPastTrips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   useEffect(() => {
//     const fetchTrips = async () => {
//       try {
//         //  CURRENT TRIP
//         const latestRes = await fetch(`${API_BASE_URL}/api/trip/latest`, {
//           credentials: "include",
//         });

//         const latestData = await latestRes.json();

//         console.log("Latest Trip:", latestData);

//         if (latestRes.ok && latestData) {
//           setCurrentTrip(latestData);
//         }

//         //  PAST TRIPS
//         const pastRes = await fetch(`${API_BASE_URL}/api/trip/past-trips`, {
//           credentials: "include",
//         });

//         const pastData = await pastRes.json();

//         if (pastRes.ok) {
//           setPastTrips(pastData);
//         }
//       } catch (err) {
//         setSnackbar({
//           open: true,
//           message: err.message,
//           severity: "error",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrips();
//   }, []);

//   if (loading)
//     return (
//       <div className="loading-customerdashboard">
//         <PacmanLoader color="#1e40af" size={25} />
//       </div>
//     );

//   return (
//     <div className="mytrips-page">
//       <h1 className="mytrips-title">My Trips</h1>

//       {/*  CURRENT TRIP */}
//       {currentTrip && (
//         <div className="current-trip-section">
//           <h2>Current Trip</h2>

//           <div className="trip-card highlight">
//             <div className="trip-header">
//               <span className="route">
//                 {currentTrip.pickupCity} ({currentTrip.pickupState}) →{" "}
//                 {currentTrip.destinationCity} ({currentTrip.destinationState})
//               </span>

//               <span className="status active-status">{currentTrip.status}</span>
//             </div>

//             <div className="trip-details">
//               <p>
//                 <strong>Date:</strong>{" "}
//                 {new Date(currentTrip.dateAndTime).toLocaleString()}
//               </p>
//               <p>
//                 <strong>Passengers:</strong> {currentTrip.passengers}
//               </p>
//               <p>
//                 <strong>Vehicle:</strong> {currentTrip.vehicleType}
//               </p>
//             </div>

//             <button
//               className="track-btn"
//               onClick={() =>
//                 navigate(`/customer/track/${currentTrip._id}`, {
//                   state: {
//                     pickupCoords: currentTrip.pickupCoordinates,
//                     destinationCoords: currentTrip.destinationCoordinates,
//                   },
//                 })
//               }
//             >
//               Track My Trip
//             </button>
//           </div>
//         </div>
//       )}

//       {/*  PAST TRIPS */}
//       <div className="past-trips-section">
//         <h2>Past Trips</h2>

//         {pastTrips.length === 0 ? (
//           <div className="no-trip-card">
//             <p>No past trips available.</p>
//           </div>
//         ) : (
//           <div className="trips-wrapper">
//             {pastTrips.map((trip) => (
//               <div className="trip-card" key={trip._id}>
//                 <div className="trip-header">
//                   <span className="route">
//                     {trip.pickupCity} ({trip.pickupState}) →{" "}
//                     {trip.destinationCity} ({trip.destinationState})
//                   </span>

//                   <span className="status">{trip.status}</span>
//                 </div>

//                 <div className="trip-details">
//                   <p>
//                     <strong>Date:</strong>{" "}
//                     {new Date(trip.dateAndTime).toLocaleString()}
//                   </p>
//                   <p>
//                     <strong>Passengers:</strong> {trip.passengers}
//                   </p>
//                   <p>
//                     <strong>Vehicle:</strong> {trip.vehicleType}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       <CustomizedSnackbars
//         open={snackbar.open}
//         message={snackbar.message}
//         severity={snackbar.severity}
//         onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
//       />
//     </div>
//   );
// }

// export default MyTrips;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/MyTrips.css";
import API_BASE_URL from "../../config/api";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";
import { PacmanLoader } from "react-spinners";

function MyTrips() {
  const navigate = useNavigate();

  const [currentTrip, setCurrentTrip] = useState(null);
  const [pastTrips, setPastTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);

      // CURRENT TRIP
      const latestRes = await fetch(`${API_BASE_URL}/api/trip/latest`, {
        credentials: "include",
      });

      const latestData = await latestRes.json();

      console.log("Latest Trip:", latestData);

      if (latestRes.ok && latestData) {
        setCurrentTrip(latestData);
      } else {
        setCurrentTrip(null);
      }

      // PAST TRIPS
      const pastRes = await fetch(`${API_BASE_URL}/api/trip/past-trips`, {
        credentials: "include",
      });

      const pastData = await pastRes.json();

      if (pastRes.ok) {
        setPastTrips(pastData);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTrip = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/trip/cancel/${currentTrip._id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel trip");
      }

      setCurrentTrip(data.trip);

      setSnackbar({
        open: true,
        message: data.message,
        severity: "success",
      });

      // refresh trips
      fetchTrips();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  const getRemainingTime = (tripDate) => {
    const now = new Date();
    const start = new Date(tripDate);

    if (now > start) return "Trip Started / Completed";

    const diff = start - now;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${hours}h ${minutes}m left`;
  };

  if (loading)
    return (
      <div className="loading-customerdashboard">
        <PacmanLoader color="#1e40af" size={25} />
      </div>
    );

  return (
    <div className="mytrips-page">
      <h1 className="mytrips-title">My Trips</h1>

      {/* CURRENT TRIP */}
      {currentTrip && (
        <div className="current-trip-section">
          <h2>Current Trip</h2>

          <div className="trip-card highlight">
            <div className="trip-header">
              <span className="route">
                {currentTrip.pickupCity} ({currentTrip.pickupState}) →{" "}
                {currentTrip.destinationCity} ({currentTrip.destinationState})
              </span>

              <span
                className={`status ${
                  currentTrip.status === "cancelled"
                    ? "cancelled-status"
                    : currentTrip.status === "completed"
                    ? "completed-status"
                    : "active-status"
                }`}
              >
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

              {/* <p>
                <strong>Trip Timer:</strong>{" "}
                {currentTrip.status === "assigned"
                  ? getRemainingTime(currentTrip.dateAndTime)
                  : currentTrip.status === "current"
                  ? "Trip in Progress"
                  : currentTrip.status === "completed"
                  ? "Trip Completed"
                  : "Trip Cancelled"}
              </p> */}
              <p>
  <strong>Trip Timer:</strong>{" "}
  {currentTrip.status === "cancelled"
    ? "Trip Cancelled"
    : currentTrip.status === "completed"
    ? "Trip Completed"
    : currentTrip.status === "current"
    ? "Trip in Progress"
    : `${currentTrip.estimatedDuration?.toFixed(1)} hrs`}
</p>
            </div>

            <div className="trip-btn-group">
              {currentTrip.status !== "cancelled" &&
                currentTrip.status !== "completed" && (
                  <>
                    <button
                      className="track-btn"
                      onClick={() =>
                        navigate(`/customer/track/${currentTrip._id}`, {
                          state: {
                            pickupCoords: currentTrip.pickupCoordinates,
                            destinationCoords:
                              currentTrip.destinationCoordinates,
                          },
                        })
                      }
                    >
                      Track My Trip
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={handleCancelTrip}
                    >
                      Cancel Trip
                    </button>
                  </>
                )}
            </div>
          </div>
        </div>
      )}

      {/* PAST TRIPS */}
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

      <CustomizedSnackbars
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </div>
  );
}

export default MyTrips;