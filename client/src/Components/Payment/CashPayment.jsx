function CashPayment({ handlePayment, loading, amount }) {
  return (
    <div>
      <div className="steps-indicator">
        <div className="step-dot active" />
        <div className="step-line active" />
        <div className="step-dot active" />
      </div>

      <div className="cash-info-box">
        <p><strong>Pay to driver on arrival</strong></p>
        <p>
          Carry exact change of <strong>₹{amount}</strong>
        </p>
        <p>Your seat is reserved. Pay the driver when you board.</p>
      </div>

      <button className="pay-btn" onClick={handlePayment} disabled={loading}>
        {loading ? "Processing…" : "Confirm booking"}
      </button>
    </div>
  );
}

export default CashPayment;