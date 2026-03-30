import React, { useState } from 'react'
import "../../Styles/Assignedtrips.css"
import { recentTripActivityData } from '../../Data/Data'
import TripMap from '../Admin/TripMap';

function AssignedTrips() {
  const [coords, setCoords] = useState(null);
  const [openMap, setOpenMap] = useState(false);
  const value = {
    source: "Chennai",
    destination: "Bangalore"
  }

   const getCoordinates = async (value) => {
      try {
        const sourceUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${value.source}`;
        const destinationUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${value.destination}`;
        const sourceRes = await fetch(sourceUrl, {
          headers: {
            "Accept": "application/json"
          }
        });

        const destinationRes = await fetch(destinationUrl, {
          headers: {
            "Accept": "application/json"
          }
        });

        const sourceData = await sourceRes.json();
        const destinationData = await destinationRes.json();
        if (sourceData.length > 0 && destinationData.length > 0) {
          setCoords({
            source: {
              lat: parseFloat(sourceData[0].lat),
              lon: parseFloat(sourceData[0].lon)
            },
            destination: {
              lat: parseFloat(destinationData[0].lat),
              lon: parseFloat(destinationData[0].lon)
            }
          });
          setOpenMap(true)
        } else {
          console.log("Location not found");
        }

      } catch (error) {
        console.error("Geocoding error:", error);
      }
};
return (
  <>
    {(openMap) ? (
      <div className='assigned-map-container'>
        <h1 className='assigned-map-title'>Map View</h1>
        {coords && <TripMap Coords={coords} />}
        <div className='assigned-map-button'>
          <button onClick={()=>{setOpenMap(false); setCoords(null)}}>← Back To Main</button>
        </div>
      </div>
      )
       : (<div className="driver-assigned-section">

  <h2 className="driver-section-title">Assigned Trip</h2>

  <div className="driver-assigned-card">

    <div className="driver-assigned-info">
      <p><strong>Trip ID:</strong> 45892</p>
      <p><strong>Pickup:</strong> Chennai</p>
      <p><strong>Destination:</strong> Bangalore</p>
      <p><strong>Date:</strong> 20 Oct 2026</p>
      <p><strong>Status:</strong> Assigned</p>
    </div>

    <div className="driver-assigned-actions">
      <button className="driver-route-btn"
         onClick={()=>getCoordinates(value)}
      >
        View Route
      </button>
    </div>

  </div>
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
         {
          recentTripActivityData.map(value=>(<tr key={value.tripId}>
              <td>{value.tripId}</td>
              <td>{value.date}</td>
              <td>{value.source.split(" ")[0]} → {value.destination.split(", ")[0]}</td>
              <td>200</td>
              <td><span className={`status-pill ${value.status.toLowerCase()}`}>{value.status}</span></td>
          </tr>))
         }
      </tbody>
    </table>
  </div>

</div>
</div>)}
    </>

  )
}

export default AssignedTrips