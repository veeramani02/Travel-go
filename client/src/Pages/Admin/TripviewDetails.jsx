import React, { useState } from "react";
import '../../Styles/TripviewDetails.css'

export default function TripviewDetails({
  isOpen,
  trip,
  onClose,
  isClosing,
  onPrint,
  onEdit
}) {

  if (!isOpen || !trip) return null;
  return (
    <div className="modal-overlay">
      <div className={`tripview-modal ${isClosing ? "close" : "open"}`}>
        <div className="modal-content">
        <h1 className="modal-title">Trip Details: #{trip.id}</h1>

        <div className="status-div">
          <div className="status-display">
            <p className={`status-pill ${trip.status.toLowerCase()}`}>
              {trip.status}
            </p>
          </div>

          <div className="button-div">
            <button onClick={() => onEdit()}>Edit Trip</button>
            <button onClick={() => onPrint(trip)}>Print Invoice</button>
          </div>
        </div>

        <div className="card-container">
          <div className="tripview-card">
            <h4 className="card-title">Passenger Information</h4>
            <p>{trip.passenger.name}</p>
            <p>{trip.passenger.email}</p>
          </div>

          <div className="tripview-card">
            <h4 className="card-title">Driver & Vehicle</h4>
            <p>{trip.driver.name}</p>
            <p>{trip.driver.vehicle}</p>
            <p>{trip.driver.phone}</p>
          </div>

          <div className="tripview-card">
            <h4 className="card-title">Routes & Schedule</h4>
            <p><strong>Pickup:</strong> {trip.route.pickup}</p>
            <p><strong>Dropoff:</strong> {trip.route.dropoff}</p>
            <p><strong>Date:</strong> {trip.route.time.split(" ")[0]}</p>
            <p><strong>Time:</strong> {trip.route.time.split(" ").slice(1).join(" ")}</p>
          </div>

          <div className="tripview-card">
            <h4 className="card-title">Payment Summary</h4>
            <p><strong>Total:</strong> {trip.payment.total}</p>
            <p><strong>Method:</strong> {trip.payment.method}</p>
            <p><strong>Status:</strong> {trip.payment.status}</p>
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
              {trip.history.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.actor}</td>
                  <td>{item.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="closeBtn">
          <button onClick={onClose} >Close</button>
        </div>
      </div>
      </div>
    </div>
  );
}