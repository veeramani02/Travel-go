import React, { useState } from "react";
import "../../Styles/TripviewDetails.css";

export default function TripviewDetails({
  isOpen,
  trip,
  onClose,
  isClosing,
  onEdit,
}) {
  if (!isOpen || !trip) return null;
  return (
    <div className="modal-overlay">
      <div className={`tripview-modal ${isClosing ? "close" : "open"}`}>
        <div className="modal-content">
          <h1 className="modal-title">
            Trip Details: #{trip._id.slice(4, 8).toUpperCase()}
          </h1>

          <div className="status-div">
            <div className="status-display">
              <h3>Status:</h3>
              <p className={`status-pill ${trip.status.toLowerCase()}`}>
                {trip.status}
              </p>
            </div>

            <div className="button-div">
              <button onClick={() => onEdit()}>Edit Trip</button>
            </div>
          </div>

          <div className="card-container">
            <div className="tripview-card">
              <h4 className="card-title">Passenger Information</h4>
              <p>{trip?.name}</p>
              <p>{trip?.email}</p>
            </div>

            <div className="tripview-card">
              <h4 className="card-title">Driver & Vehicle</h4>
              {trip?.driverId ? <p>{trip?.driverId}</p> : <p>Not Assigned</p>}
            </div>

            <div className="tripview-card">
              <h4 className="card-title">Routes & Schedule</h4>
              <p>
                <strong>Pickup:</strong> {trip.pickupCity}
              </p>
              <p>
                <strong>Dropoff:</strong> {trip.destinationCity}
              </p>
              {(() => {
                const dt = trip?.dateAndTime;
                if (!dt) return "-";

                const [date, time] = dt.split("T");
                const cleanTime = time?.split(".")[0];

                return (
                  <>
                    <p>
                      <strong>Date:</strong> {date}
                    </p>
                    <p>
                      <strong>Time:</strong> {cleanTime}
                    </p>
                  </>
                );
              })()}
            </div>

            <div className="tripview-card">
              <h4 className="card-title">Payment Summary</h4>
              <p>
                <strong>Total:</strong> {trip.amount}
              </p>
              <p>
                <strong>Method:</strong>Cash
              </p>
              <p>
                <strong>Status:</strong> {trip?.paymentStatus}
              </p>
            </div>
          </div>

          <div className="table-container">
            <h4 className="table-title">Trip History</h4>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Driver</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                <td colSpan="3" className="no-data">
                  "No History Trip"
                </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="closeBtn">
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
