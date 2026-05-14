import React, { useEffect, useState } from "react";
import "../../Styles/PaymentHistory.css";
import API_BASE_URL from "../../config/api";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/payments`, {
          credentials: "include",
        });

        const data = await res.json();

        console.log("Payments:", data);

        if (res.ok) {
          setPayments(data.payments || []);
        }
      } catch (err) {
        console.error("Fetch Payment Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);
  if (loading) {
    return (
      <div className="paymenthistory-page">
        <h2>Loading payments...</h2>
      </div>
    );
  }

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
            <div className="payment-card" key={payment._id || index}>
              <div className="payment-left">
                <div className="txn-id">
                  <strong>Transcation Id:</strong>{" "}
                  {payment.transactionId || `TXN00${index + 1}`}
                </div>

                <div className="payment-details">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(payment.createdAt).toLocaleString()}
                  </p>

                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {payment.paymentMethod.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="payment-right">
                <div className="payment-amount">₹ {payment.amount}</div>

                <div className="payment-status">{payment.paymentStatus}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaymentHistory;
