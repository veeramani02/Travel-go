import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Payments.css";

import PaymentMethod from "../../components/payment/PaymentMethod";
import CardPayment from "../../components/payment/CardPayment";
import UpiPayment from "../../components/payment/UpiPayment";
import CashPayment from "../../components/payment/CashPayment";
import DuesPayment from "../../components/payment/DuesPayment";

function Payments() {
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [months, setMonths] = useState("");
  const [step, setStep] = useState(1);

  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/trip/latest", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setTrip(data);
        setFinalAmount(data.price || 1000);
      } catch (err) {
        console.error("Fetch Trip Error:", err);
      }
    };
    fetchTrip();
  }, []);

  const applyVoucher = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/voucher/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const handlePayment = async () => {
    if (!trip) return;
    setLoading(true);
    try {
      const payload = {
        tripId: trip._id,
        paymentMethod,
        voucherCode: voucherCode || null,
      };
      if (paymentMethod === "dues") {
        if (!months) {
          alert("Select months plan");
          setLoading(false);
          return;
        }
        payload.months = Number(months);
      }

      const res = await fetch("http://localhost:3000/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const paymentId = data.payment._id;

      const updateRes = await fetch(
        `http://localhost:3000/api/payments/${paymentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
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

  /* ── Success screen ── */
  if (paymentSuccess) {
    return (
      <div className="payment-page">
        <div className="payment-card success-card">
          <div className="card-header">
            <h2>Payment complete</h2>
            <p>Thank you for booking with us</p>
          </div>
          <div className="card-body">
            <div className="success-icon">✓</div>
            <h1>Payment successful!</h1>
            <p>Your trip has been confirmed and is ready to go.</p>

            <div className="points-badge">
              <span className="points-count">{points}</span>
              <span className="points-label">loyalty points earned</span>
            </div>

            <button
              className="pay-btn"
              onClick={() => navigate("/customer/payment-history")}
            >
              View payment history
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── No trip found ── */
  if (!trip) {
    return (
      <div className="payment-page">
        <div className="payment-card no-trip-card">
          <div className="card-header">
            <h2>Payment</h2>
            <p>No pending trip found</p>
          </div>
          <div className="card-body">
            <h2>No pending trip found</h2>
            <button
              className="pay-btn"
              onClick={() => navigate("/customer/book-trip")}
            >
              Book a trip
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main payment page ── */
  return (
    <div className="payment-page">
      <div className="payment-card">

        {/* Header */}
        <div className="card-header">
          <h2>Payment summary</h2>
          <p>Complete your trip booking</p>
          <div className="route-row">
            <span className="route-city">{trip.pickupCity}</span>
            <span className="route-arrow">→</span>
            <span className="route-city">{trip.destinationCity}</span>
          </div>
        </div>

        <div className="card-body">

          {/* Trip summary grid */}
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-label">Date</div>
              <div className="summary-value">
                {new Date(trip.dateAndTime).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Passengers</div>
              <div className="summary-value">{trip.passengers}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Vehicle</div>
              <div className="summary-value">{trip.vehicleType}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Time</div>
              <div className="summary-value">
                {new Date(trip.dateAndTime).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>

          <hr className="payment-divider" />

          {/* Price breakdown */}
          <div className="price-box">
            <div className="price-row">
              <span className="price-label">Base fare</span>
              <span className="price-val">₹{trip.price || 1000}</span>
            </div>

            {discount > 0 && (
              <div className="price-row">
                <span className="price-label">
                  Discount
                  <span className="discount-badge">{discount}% off</span>
                </span>
                <span className="price-discount">
                  -₹{Math.round((trip.price || 1000) * discount / 100)}
                </span>
              </div>
            )}

            <div className="price-total-row">
              <span className="price-total-label">Total payable</span>
              <span className="price-total-amount">₹{finalAmount}</span>
            </div>
          </div>

          {/* Voucher */}
          <div className="voucher-box">
            <input
              type="text"
              placeholder="Enter voucher code"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
            />
            <button className="voucher-apply-btn" onClick={applyVoucher}>
              Apply
            </button>
          </div>

          <hr className="payment-divider" />

          {/* Step 1 — choose method */}
          {step === 1 && (
            <PaymentMethod
              setPaymentMethod={setPaymentMethod}
              setStep={setStep}
            />
          )}

          {/* Step 2 — payment form */}
          {step === 2 && (
            <>
              <div className="step2-header">
                <button className="back-btn" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <span className="step2-title">
                  {paymentMethod === "card" && "Card details"}
                  {paymentMethod === "upi" && "UPI payment"}
                  {paymentMethod === "cash" && "Cash payment"}
                  {paymentMethod === "dues" && "Pay in instalments"}
                </span>
              </div>

              {paymentMethod === "card" && (
                <CardPayment
                  handlePayment={handlePayment}
                  loading={loading}
                />
              )}
              {paymentMethod === "upi" && (
                <UpiPayment
                  handlePayment={handlePayment}
                  loading={loading}
                />
              )}
              {paymentMethod === "cash" && (
                <CashPayment
                  handlePayment={handlePayment}
                  loading={loading}
                  amount={finalAmount}
                />
              )}
              {paymentMethod === "dues" && (
                <DuesPayment
                  months={months}
                  setMonths={setMonths}
                  handlePayment={handlePayment}
                  loading={loading}
                  totalAmount={finalAmount}
                />
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Payments;