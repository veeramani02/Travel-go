import { useState } from "react";

function CardPayment({ handlePayment, loading }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, "").substring(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").substring(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  };

  return (
    <div>
      <div className="steps-indicator">
        <div className="step-dot active" />
        <div className="step-line active" />
        <div className="step-dot active" />
      </div>

      <div className="field-group">
        <div className="field-label">Card number</div>
        <input
          className="field-input"
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          maxLength={19}
        />
      </div>

      <div className="field-row">
        <div className="field-group">
          <div className="field-label">Expiry</div>
          <input
            className="field-input"
            type="text"
            placeholder="MM / YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            maxLength={7}
          />
        </div>
        <div className="field-group">
          <div className="field-label">CVV</div>
          <input
            className="field-input"
            type="password"
            placeholder="•••"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 3))}
            maxLength={3}
          />
        </div>
      </div>

      <div className="field-group">
        <div className="field-label">Name on card</div>
        <input
          className="field-input"
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button className="pay-btn" onClick={handlePayment} disabled={loading}>
        {loading ? "Processing…" : "Confirm & Pay"}
      </button>
    </div>
  );
}

export default CardPayment;