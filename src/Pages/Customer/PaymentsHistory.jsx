// import React, { useEffect, useState } from "react";
// import "../../Styles/PaymentHistory.css";

// function PaymentHistory() {
//   const [payments, setPayments] = useState([]);

//   useEffect(() => {
//     const trips = JSON.parse(localStorage.getItem("tripHistory")) || [];

//     // Only paid trips
//     const paidTrips = trips.filter(
//       (trip) => trip.status === "Booked"
//     );

//     // Latest first
//     const sorted = [...paidTrips].reverse();

//     setPayments(sorted);
//   }, []);

//   return (
//     <div className="paymenthistory-page">
//       <h1 className="paymenthistory-title">Payment History</h1>

//       {payments.length === 0 ? (
//         <div className="no-payment-card">
//           <h3>No Payments Found</h3>
//           <p>You haven't made any payments yet.</p>
//         </div>
//       ) : (
//         <div className="paymenthistory-wrapper">
//           {payments.map((payment, index) => (
//             <div className="payment-card" key={index}>
//               <div className="payment-card-header">
//                 <span className="txn-id">
//                   {payment.transactionId || "TXN" + index}
//                 </span>
//                 <span className="payment-status">
//                   {payment.status}
//                 </span>
//               </div>

//               <div className="payment-route">
//                 {payment.pickupCity} ({payment.pickupState}) → {payment.destinationCity}({payment.destinationState})
//               </div>

//               <div className="payment-details">
//                 <p>
//                   <strong>Date:</strong>{" "}
//                   {new Date(payment.paidAt || payment.travelDate).toLocaleString()}
//                 </p>

//                 {/* <p>
//                   <strong>Vehicle:</strong> {payment.vehicleType}
//                 </p> */}

//                 <p>
//                   <strong>Payment Method:</strong> {payment.paymentMethod}
//                 </p>
//               </div>

//               <div className="payment-amount">
//                 ₹ {payment.amount || 3500}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default PaymentHistory;
import React, { useEffect, useState } from "react";
import "../../Styles/PaymentHistory.css";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const trips = JSON.parse(localStorage.getItem("tripHistory")) || [];

    const paidTrips = trips.filter((trip) => trip.status === "Booked");

    const sorted = [...paidTrips].reverse();

    setPayments(sorted);
  }, []);

  return (
    <div className="paymenthistory-page">
      <h1 className="paymenthistory-title">Payment History</h1>

      {payments.length === 0 ? (
        <div className="no-payment-card">
          <h3>No Payments Found</h3>
          <p>You haven't made any payments yet.</p>
        </div>
      ) : (
        <div className="paymenthistory-wrapper">
          {payments.map((payment, index) => (
            <div className="payment-card" key={index}>

              {/* LEFT SIDE */}
              <div className="payment-left">
                <div className="txn-id">
                  {payment.transactionId || `TXN00${index + 1}`}
                </div>

                <div className="payment-route">
                  {payment.pickupCity || payment.pickup} ({payment.pickupState || ""})
                  {" "}→{" "}
                  {payment.destinationCity || payment.destination} ({payment.destinationState || ""})
                </div>

                <div className="payment-details">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      payment.paidAt || payment.travelDate
                    ).toLocaleString()}
                  </p>

                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {payment.paymentMethod}
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="payment-right">
                <div className="payment-amount">
                  ₹ {payment.amount || 3500}
                </div>

                <div className="payment-status">
                  {payment.status}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaymentHistory;