import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Payments.css";

function Payments() {
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  //  Voucher states
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  //  Fetch latest trip
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/trip/latest", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setTrip(data);

        //  base amount
        setFinalAmount(data.price || 1000);
      } catch (err) {
        console.error("Fetch Trip Error:", err);
      }
    };

    fetchTrip();
  }, []);

  //  APPLY VOUCHER
  const applyVoucher = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/voucher/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code: voucherCode }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg);

      setDiscount(data.discount);

      const discountAmount = ((trip.price || 1000) * data.discount) / 100;
      setFinalAmount((trip.price || 1000) - discountAmount);

      alert("Voucher Applied ✅");
    } catch (err) {
      alert(err.message);
    }
  };

  //  PAYMENT HANDLER
  const handlePayment = async () => {
    if (!trip) return;

    setLoading(true);

    try {
   
      const res = await fetch("http://localhost:3000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          tripId: trip._id,
          paymentMethod,
          voucherCode: voucherCode || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      const paymentId = data.payment._id;

      //  UPDATE STATUS
      const updateRes = await fetch(
        `http://localhost:3000/api/payments/${paymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: "Completed",
            transactionId: "TXN" + Date.now(),
            voucherCode: voucherCode || null,
          }),
        }
      );

      const updateData = await updateRes.json();

      if (!updateRes.ok) throw new Error(updateData.message);

      setPoints(updateData.earnedPoints || 0);
      setPaymentSuccess(true);

    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  //  SUCCESS UI
  if (paymentSuccess) {
    return (
      <div className="payment-page">
        <div className="payment-card success-card">
          <h1>Payment Successful 🎉</h1>
          <p>Your trip has been successfully booked.</p>

          <p>
            <strong>{points}</strong> ⭐ loyalty points earned
          </p>

          <button
            className="pay-btn"
            onClick={() => navigate("/customer/payment-history")}
          >
            View Payments
          </button>
        </div>
      </div>
    );
  }

  //  NO TRIP
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

  //  MAIN UI
  return (
    <div className="payment-page">
      <div className="payment-card">
        <h1 className="payment-title">Payment Summary</h1>

        <div className="summary-box">
          <p><strong>From:</strong> {trip.pickupCity}</p>
          <p><strong>To:</strong> {trip.destinationCity}</p>
          <p><strong>Date:</strong> {new Date(trip.dateAndTime).toLocaleString()}</p>
          <p><strong>Passengers:</strong> {trip.passengers}</p>
          <p><strong>Vehicle:</strong> {trip.vehicleType}</p>
        </div>

        {/*  PRICE SECTION */}
        <div className="price-box">
          <h3>Original Amount: ₹{trip.price || 1000}</h3>
          {discount > 0 && <h4>Discount: {discount}%</h4>}
          <h2>Final Amount: ₹{finalAmount}</h2>
        </div>

        {/*  VOUCHER */}
        <div className="voucher-box">
          <input
            type="text"
            placeholder="Enter voucher code"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
          />
          <button onClick={applyVoucher}>Apply</button>
        </div>

        {/*  PAYMENT METHOD */}
        <h3>Select Payment Method</h3>

        <div className="payment-methods">
          {["card", "upi", "cash"].map((method) => (
            <label key={method}>
              <input
                type="radio"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              {method.toUpperCase()}
            </label>
          ))}
        </div>

        <button
          className="pay-btn"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm & Pay"}
        </button>
      </div>
    </div>
  );
}

export default Payments;