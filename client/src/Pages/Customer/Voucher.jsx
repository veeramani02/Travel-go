import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Voucher.css";
import API_BASE_URL from "../../config/api";

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [copiedCode, setCopiedCode] = useState("");
  const navigate = useNavigate();

  const fetchVouchers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/voucher/my`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      const available = data.vouchers.filter(
        (v) => !v.isUsed && new Date(v.expiryDate) > new Date(),
      );

      setVouchers(available);
    } catch (err) {
      console.error("Error fetching vouchers:", err);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);

    setTimeout(() => {
      setCopiedCode("");
    }, 2000);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>My Vouchers</h2>

      {vouchers.length === 0 ? (
        <div style={{ marginTop: "40px" }}>
          <p style={{ fontSize: "18px", color: "#555" }}>
            No vouchers available 😔
          </p>

          <p style={{ marginBottom: "20px" }}>
            Redeem your points to get discounts on trips!
          </p>

          <button
            onClick={() => navigate("/customer/LoyaltyPoints")}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#1E40AF",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Go to Rewards 🎁
          </button>
        </div>
      ) : (
        vouchers.map((v) => (
          <div key={v._id} className="voucher-container">
            <div className="voucher-card">
              <h2 className="voucher-title">Your Voucher</h2>

              <div className="voucher-code-box">
                <span className="voucher-code">{v.code}</span>

                <button className="copy-btn" onClick={() => handleCopy(v.code)}>
                  Copy
                </button>
              </div>

              <p className="voucher-discount">
                🎉 {v.discount}% OFF on your next trip
              </p>

              <p className="voucher-expiry">
                ⏳ Valid till: {new Date(v.expiryDate).toLocaleDateString()}
              </p>

              {copiedCode === v.code && (
                <span className="copied-text">Copied!</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Voucher;
