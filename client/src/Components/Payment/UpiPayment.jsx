import { useState } from "react";

function UpiPayment({ handlePayment, loading }) {
  const [upiId, setUpiId] = useState("");

  const apps = ["GPay", "PhonePe", "Paytm", "BHIM"];

  return (
    <div>
      <div className="steps-indicator">
        <div className="step-dot active" />
        <div className="step-line active" />
        <div className="step-dot active" />
      </div>

      <div className="field-group">
        <div className="field-label">UPI ID</div>
        <input
          className="field-input"
          type="text"
          placeholder="yourname@upi"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
        />
      </div>

      <div className="upi-apps">
        {apps.map((app) => (
          <button key={app} className="upi-app-btn">
            {app}
          </button>
        ))}
      </div>

      <button className="pay-btn" onClick={handlePayment} disabled={loading}>
        {loading ? "Processing…" : "Confirm & Pay"}
      </button>
    </div>
  );
}

export default UpiPayment;