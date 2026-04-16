function PaymentMethod({ setPaymentMethod, setStep }) {
  const methods = [
    { id: "card",  label: "Card",  icon: "💳" },
    { id: "upi",   label: "UPI",   icon: "📱" },
    { id: "cash",  label: "Cash",  icon: "💵" },
    { id: "dues",  label: "Dues",  icon: "🗓️" },
  ];

  return (
    <>
      <div className="steps-indicator">
        <div className="step-dot active" />
        <div className="step-line" />
        <div className="step-dot" />
      </div>

      <div className="section-label">Select payment method</div>

      <div className="payment-methods">
        {methods.map(({ id, label, icon }) => (
          <button
            key={id}
            className="method-btn"
            onClick={() => {
              setPaymentMethod(id);
              setStep(2);
            }}
          >
            <span className="method-icon">{icon}</span>
            <span className="method-name">{label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

export default PaymentMethod;