import "../../Styles/Login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // clear error while typing
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase letter and 1 special character"
      );
      return;
    }

    
    let role = "customer";

    if (formData.email === "admin@gmail.com") {
      role = "admin";
    } else if (formData.email === "driver@gmail.com") {
      role = "driver";
    }

    localStorage.setItem("role", role);

    //  Navigate
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="auth-wrapper">
    <div className="container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group password-group">
          <label>Password:</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <div className="btn">
          <button type="submit" className="login-btn">
            Login
          </button>
        </div>

        <p className="signup-link">
          Don't have an account?{" "}
          <Link to="/signup">Sign Up</Link>
        </p>

      </form>
    </div>
    </div>
  );
}

export default Login;
