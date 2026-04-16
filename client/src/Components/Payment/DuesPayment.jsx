function DuesPayment({ months, setMonths, handlePayment, loading, totalAmount }) {
  const plans = [
    { value: "3", label: "3 months" },
    { value: "6", label: "6 months" },
  ];

  const getEmi = (m) => Math.ceil((totalAmount || 1000) / Number(m));

  return (
    <div className="dues-box">
      <div className="steps-indicator">
        <div className="step-dot active" />
        <div className="step-line active" />
        <div className="step-dot active" />
      </div>

      <div className="section-label">Choose instalment plan</div>

      <div className="dues-plans-grid">
        {plans.map(({ value, label }) => (
          <div
            key={value}
            className={`plan-option ${months === value ? "selected" : ""}`}
            onClick={() => setMonths(value)}
          >
            <div className="plan-months">{label}</div>
            <div className="plan-emi">₹{getEmi(value)}/mo</div>
          </div>
        ))}
      </div>

      <button
        className="pay-btn"
        onClick={handlePayment}
        disabled={loading || !months}
        style={{ marginTop: "16px" }}
      >
        {loading ? "Processing…" : "Confirm & Pay"}
      </button>
    </div>
  );
}

export default DuesPayment;