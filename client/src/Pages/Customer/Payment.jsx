// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../Styles/Payments.css";

// function Payments() {
//   const navigate = useNavigate();

//   const [trip, setTrip] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("card");
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [points, setPoints] = useState(0);
//   const [loading, setLoading] = useState(false);

//   // Fetch latest trip from backend
//   useEffect(() => {
//     const fetchTrip = async () => {
//       try {
//         const res = await fetch("http://localhost:3000/api/trip/latest", {
//           credentials: "include",
//         });

//         const data = await res.json();

//         if (!res.ok) throw new Error(data.message);

//         setTrip(data);
//       } catch (err) {
//         console.error("Fetch Trip Error:", err);
//       }
//     };

//     fetchTrip();
//   }, []);

//   //  Handle Payment API
//   const handlePayment = async () => {
//     if (!trip) return;

//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:3000/api/payments", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include", //  cookie send
//         body: JSON.stringify({
//           tripId: trip._id,
//           amount: 1000,
//           paymentMethod,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message);

//       //  Loyalty points (frontend display only)
//       const randomPoints = Math.floor(Math.random() * 200) + 1;
//       setPoints(randomPoints);

//       setPaymentSuccess(true);
//     } catch (err) {
//       console.error("Payment Error:", err);
//       alert("Payment Failed ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   //  SUCCESS 
//   if (paymentSuccess) {
//     return (
//       <div className="payment-page">
//         <div className="payment-card success-card">
//           <h1>Payment Successful 🎉</h1>
//           <p>Your trip has been successfully booked.</p>
//           <p>
//             <strong>{points}</strong> ⭐ loyalty points added
//           </p>

//           <div className="success-buttons">
//             <button
//               className="pay-btn"
//               onClick={() => navigate("/customer/book-trip")}
//             >
//               Book New Trip
//             </button>

//             <button
//               className="pay-btn secondary-btn"
//               onClick={() => navigate("/customer/my-trips")}
//             >
//               Check My Trips
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   //  NO TRIP
//   if (!trip) {
//     return (
//       <div className="payment-page">
//         <div className="payment-card">
//           <h2>No Pending Trip Found</h2>
//           <button
//             className="pay-btn"
//             onClick={() => navigate("/customer/book-trip")}
//           >
//             Book Trip
//           </button>
//         </div>
//       </div>
//     );
//   }

//   //  PAYMENT PAGE
//   return (
//     <div className="payment-page">
//       <div className="payment-card">
//         <h1 className="payment-title">Payment Summary</h1>

//         <div className="summary-box">
//           <p>
//             <strong>From:</strong> {trip.pickupCity} ({trip.pickupState})
//           </p>
//           <p>
//             <strong>To:</strong> {trip.destinationCity} ({trip.destinationState})
//           </p>
//           <p>
//             <strong>Date:</strong>{" "}
//             {new Date(trip.dateAndTime).toLocaleString()}
//           </p>
//           <p>
//             <strong>Passengers:</strong> {trip.passengers}
//           </p>
//           <p>
//             <strong>Vehicle:</strong> {trip.vehicleType}
//           </p>
//         </div>

//         <h3>Select Payment Method</h3>

//         <div className="payment-methods">
//           <label>
//             <input
//               type="radio"
//               value="card"
//               checked={paymentMethod === "card"}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             />
//             Credit / Debit Card
//           </label>

//           <label>
//             <input
//               type="radio"
//               value="upi"
//               checked={paymentMethod === "upi"}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             />
//             UPI
//           </label>

//           <label>
//             <input
//               type="radio"
//               value="cash"
//               checked={paymentMethod === "cash"}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             />
//             Cash on Trip
//           </label>

//           <label>
//             <input
//               type="radio"
//               value="cash"
//               checked={paymentMethod === "cash"}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             />
//              Pay with Dues
//           </label>
//         </div>

//         <button
//           className="pay-btn"
//           onClick={handlePayment}
//           disabled={loading}
//         >
//           {loading ? "Processing..." : "Confirm & Pay"}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Payments;
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
      } catch (err) {
        console.error("Fetch Trip Error:", err);
      }
    };

    fetchTrip();
  }, []);

  //  PAYMENT HANDLER
  const handlePayment = async () => {
    if (!trip) return;

    setLoading(true);

    try {
      //  CREATE PAYMENT
      const res = await fetch("http://localhost:3000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          tripId: trip._id,
          amount: 1000,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      const paymentId = data.payment._id;

      //  UPDATE PAYMENT STATUS 
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
          }),
        }
      );

      const updateData = await updateRes.json();

      if (!updateRes.ok) throw new Error(updateData.message);

      //   SUCCESS UI
      const randomPoints = Math.floor(Math.random() * 200) + 1;
      setPoints(randomPoints);
      setPaymentSuccess(true);

    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  //  SUCCESS PAGE
  if (paymentSuccess) {
    return (
      <div className="payment-page">
        <div className="payment-card success-card">
          <h1>Payment Successful 🎉</h1>
          <p>Your trip has been successfully booked.</p>
          <p>
            <strong>{points}</strong> ⭐ loyalty points added
          </p>

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

  //  PAYMENT UI
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
            {new Date(trip.dateAndTime).toLocaleString()}
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

          <label>
            <input
              type="radio"
              value="dues"
              checked={paymentMethod === "dues"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Pay with Dues
          </label>
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