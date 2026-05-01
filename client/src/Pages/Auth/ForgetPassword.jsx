import { useState } from "react";
import API_BASE_URL from "../../config/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setMessage("");
        return;
      }

      setMessage(data.message);
      setError("");
      setEmail("");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Forgot Password</h1>

          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p className="error">{error}</p>}

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="btn">
            <button type="submit" className="login-btn">
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;