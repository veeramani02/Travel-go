import { useState } from "react";
function CardPayment({ handlePayment, loading }) {
 return (
    <div>
      <div className="steps-indicator">
        <div className="step-dot active" />
        <div className="step-line active" />
        <div className="step-dot active" />
      </div>
        <button className="pay-btn" onClick={handlePayment} disabled={loading}>
        {loading ? "Processing…" : "Confirm & Pay"}
      </button>
    </div>
  );
}

export default CardPayment;