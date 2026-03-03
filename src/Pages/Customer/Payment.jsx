import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Payments.css"


function Payments() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const[points,setPoints]=useState(0)
  useEffect(() => {
    const storedTrip = JSON.parse(localStorage.getItem("pendingTrip"));
    if (storedTrip) {
      setTrip(storedTrip);
    }
  }, []);
//  const currentPoints = Number(localStorage.getItem("loyaltyPoints")) || 0;
// const updatedTotal = currentPoints + randomPoints;
// localStorage.setItem("loyaltyPoints", updatedTotal);

 const handlePayment = () => {
  if (!trip) return;
  const randomPoints = Math.floor(Math.random() * 200) + 1;
  setPoints(randomPoints);

  const completedTrip = {
    id: "TRIP_" + Date.now(), 
    ...trip,
    status: "Assigned",      
    paymentMethod,
    paidAt: new Date().toISOString(),
    LoyaltyPoints:randomPoints
  };

  const existingTrips =
    JSON.parse(localStorage.getItem("tripHistory")) || [];

  localStorage.setItem(
    "tripHistory",
    JSON.stringify([...existingTrips, completedTrip])
  );

  localStorage.removeItem("pendingTrip");

  setPaymentSuccess(true);
};

  if (paymentSuccess) {
    return (
      <div className="payment-page">
        <div className="payment-card success-card">
          <h1>Payment Successful 🎉</h1>
          <p>Your trip has been successfully booked.</p>
          <p><strong>{points}</strong> ⭐ loyalty points added </p>

          <div className="success-buttons">
            <button
              className="pay-btn"
              onClick={() => navigate("/customer/book-trip")}
            >
              Book New Trip
            </button>

            <button
              className="pay-btn secondary-btn"
              onClick={() => navigate("/customer/my-trips")}
            >
              Check My Trips
            </button>
          </div>
        </div>
      </div>
    );
  }


  if (!trip) {
    return (
      <div className="payment-page">
        <div className="payment-card">
          <h2>No Pending Trip Found</h2>
          <button
            className="pay-btn"
            onClick={() => navigate("/customer/book-trip")}
          >
            Book Trip
          </button>
        </div>
      </div>
    );
  }

 
  return (
    <div className="payment-page">
      <div className="payment-card">
        <h1 className="payment-title">Payment Summary</h1>

        <div className="summary-box">
          <p>
            <strong>From:</strong> {trip.pickupCity} ({trip.pickupState})
          </p>
          <p>
            <strong>To:</strong> {trip.destinationCity} ({trip.destinationState})
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(trip.travelDate).toLocaleString()}
          </p>
          <p>
            <strong>Passengers:</strong> {trip.passengers}
          </p>
          <p>
            <strong>Vehicle:</strong> {trip.vehicleType}
          </p>
        </div>

        <h3>Select Payment Method</h3>

        <div className="payment-methods">
          <label>
            <input
              type="radio"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Credit / Debit Card
          </label>

          <label>
            <input
              type="radio"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            UPI
          </label>

          <label>
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Trip
          </label>
        </div>

        <button className="pay-btn" onClick={handlePayment}>
          Confirm & Pay
        </button>
      </div>
    </div>
  );
}

export default Payments;