import "../../Styles/Login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

function Login() {
  const{setUser}=useAuth()
  const navigate = useNavigate();
const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
 const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }
try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", //  cookie important
        body: JSON.stringify(formData),
      });
  const data = await res.json();
  if (!res.ok) {
        setError(data.message);
        return;
      }

      // backend la role varum
      const role = data.user.role;

      // optional
      localStorage.setItem("role", role);

      // redirect based on role
      setUser(data.user)
      navigate(`/${role}/dashboard`);
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
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
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;