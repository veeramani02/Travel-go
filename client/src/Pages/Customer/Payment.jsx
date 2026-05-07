import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Payments.css";
import PaymentMethod from "../../components/payment/PaymentMethod";
import CardPayment from "../../components/payment/CardPayment";
import UpiPayment from "../../components/payment/UpiPayment";
import CashPayment from "../../components/payment/CashPayment";
import DuesPayment from "../../components/payment/DuesPayment";
import API_BASE_URL from "../../config/api";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
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
        const res = await fetch(`${API_BASE_URL}/api/trip/latest`, {
          credentials: "include",
        });
        const data = await res.json();
      console.log("KEY:", import.meta.env.VITE_RAZORPAY_KEY_ID);
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
      const res = await fetch(`${API_BASE_URL}/api/voucher/apply`, {
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

  const createAndCompletePayment = async (transactionId) => {
    const res = await fetch(`${API_BASE_URL}/api/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        tripId: trip._id,
        paymentMethod,
        voucherCode: voucherCode || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    const updateRes = await fetch(
      `${API_BASE_URL}/api/payments/${data.payment._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status: "Completed",
          transactionId,
          voucherCode: voucherCode || null,
        }),
      }
    );
    const updateData = await updateRes.json();
    if (!updateRes.ok) throw new Error(updateData.message);
    return updateData;
  };

  const handleRazorpayPayment = async () => {
    if (!trip) return;
    setLoading(true);

    try {
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        alert("Failed to load Razorpay. Check your internet connection.");
        setLoading(false);
        return;
      }

      const orderRes = await fetch(
        `${API_BASE_URL}/api/payments/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ amount: finalAmount, tripId: trip._id }),
        }
      );
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message);

      // 3. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,             
        currency: orderData.order.currency,
        name: "Trip Booking",
        description: `${trip.pickupCity} → ${trip.destinationCity}`,
        order_id: orderData.order.id,
        method: paymentMethod === "upi" ? { upi: true } : undefined,
        prefill: {
          
        },
        theme: { color: "#2563eb" },
        
       
        handler: async function (response) {
          try {
           
            const verifyRes = await fetch(
              `${API_BASE_URL}/api/payments/verify-payment`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error("Signature mismatch");

            // Record in your DB
            const updateData = await createAndCompletePayment(
              response.razorpay_payment_id
            );
            setPoints(updateData.earnedPoints || 0);
            setPaymentSuccess(true);
          } catch (err) {
            console.error("Verification Error:", err);
            alert("Payment verification failed");
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Razorpay failure:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Razorpay flow error:", err);
      alert("Could not initiate payment ❌");
      setLoading(false);
    }
  };
  const handlePayment = async () => {
    if (!trip) return;
    setLoading(true);
    try {
      if (paymentMethod === "dues" && !months) {
        alert("Select months plan");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tripId: trip._id,
          paymentMethod,
          voucherCode: voucherCode || null,
          ...(paymentMethod === "dues" ? { months: Number(months) } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const updateRes = await fetch(
        `${API_BASE_URL}/api/payments/${data.payment._id}`,
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
      alert("Payment Failed");
    } finally {
      setLoading(false);
    }
  };

 
  const handlePaymentByMethod = () => {
    if (paymentMethod === "card" || paymentMethod === "upi") {
      handleRazorpayPayment();
    } else {
      handlePayment();
    }
  };

 
  if (paymentSuccess) {
    return (
      <div className="payment-page">
        <div className="payment-card success-card">
          <div className="card-header">
            <h2>Payment complete</h2>
            <p className="greetings">Thank you for booking with us</p>
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

 
  return (
    <div className="payment-page">
      <div className="payment-card">
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
                  -₹{Math.round(((trip.price || 1000) * discount) / 100)}
                </span>
              </div>
            )}
            <div className="price-total-row">
              <span className="price-total-label">Total payable</span>
              <span className="price-total-amount">₹{finalAmount}</span>
            </div>
          </div>

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

          {step === 1 && (
            <PaymentMethod
              setPaymentMethod={setPaymentMethod}
              setStep={setStep}
            />
          )}

          {step === 2 && (
            <>
              <div className="step2-header">
                <button className="back-btn" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <span className="step2-title">
                  {paymentMethod === "card" && " pay with card"}
                  {paymentMethod === "netbanking" && "Net Banking"}
                  {paymentMethod === "cash" && "Cash payment"}
                  {paymentMethod === "dues" && "Pay in instalments"}
                </span>
              </div>

            
              {paymentMethod === "card" && (
                <CardPayment
                  handlePayment={handlePaymentByMethod}
                  loading={loading}
                />
              )}
              {paymentMethod === "netbanking" && (
                <UpiPayment
                  handlePayment={handlePaymentByMethod}
                  loading={loading}
                />
              )}

             
              {paymentMethod === "cash" && (
                <CashPayment
                  handlePayment={handlePaymentByMethod}
                  loading={loading}
                  amount={finalAmount}
                />
              )}
              {paymentMethod === "dues" && (
                <DuesPayment
                  months={months}
                  setMonths={setMonths}
                  handlePayment={handlePaymentByMethod}
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