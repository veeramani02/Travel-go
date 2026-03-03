// import "../../Styles/Signup.css"
// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// function Signup() {
//   const navigate=useNavigate()
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: ""
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const { name, email, phone, password } = formData;

//     // ✅ Empty validation
//     if (!name || !email || !phone || !password) {
//       setError("All fields are required");
//       return;
//     }

//     // ✅ Indian phone validation (10 digits)
//     const phoneRegex = /^[6-9]\d{9}$/;

//     if (!phoneRegex.test(phone)) {
//       setError("Enter valid Indian phone number");
//       return;
//     }

//     // ✅ Password validation
//     const passwordRegex =
//       /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

//     if (!passwordRegex.test(password)) {
//       setError(
//         "Password must be at least 8 characters, include 1 uppercase letter and 1 special character"
//       );
//       return;
//     }

//     setError("");
//     console.log(formData);
//   };

//   return (
//     <div className="container">
//       <form onSubmit={handleSubmit}>
//         <h1>Sign Up</h1>

//         {error && <p className="error">{error}</p>}

//         <div className="form-group">
//           <label>Name:</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="Enter name"
//             value={formData.name}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="form-group">
//           <label>Email:</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Enter email"
//             value={formData.email}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="form-group">
//           <label>Phone Number:</label>
//           <input
//             type="number"
//             name="phone"
//              placeholder="Enter phone number"
//             value={formData.phone}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="form-group password-group">
//           <label>Password:</label>
//           <div className="password-wrapper">
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="Enter password"
//               value={formData.password}
//               onChange={handleChange}
//             />
//             <span
//               className="toggle"
//               onClick={() => setShowPassword(!showPassword)}
//               style={{ cursor: "pointer" }}
//             >
//               {showPassword ? "Hide" : "Show"}
//             </span>
//           </div>
//         </div>

//         <div className="btn">
//           <button type="submit" className="signup-btn" onClick={()=>navigate("/login")}>
//             Register
//           </button>
//         </div>
//         <p className="login-link">
//   Already have an account? <span><Link to="/login">Login</Link></span>   
//         </p>
//       </form>
//     </div>
//   );
// }

// export default Signup;


import "../../Styles/Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const password = formData.password.trim();

    // ✅ Empty validation
    if (!name || !email || !phone || !password) {
      setError("All fields are required");
      return;
    }

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Enter valid email address");
      return;
    }

    // ✅ Indian phone validation (10 digits, starts with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      setError("Enter valid Indian phone number");
      return;
    }

    // ✅ Password validation
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase letter and 1 special character"
      );
      return;
    }

    // ✅ If everything valid
    setError("");
    console.log("Form Submitted:", { name, email, phone, password });

    // Navigate only after successful validation
    navigate("/login");
  };

  return (
    <div className="auth-wrapper">
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>

        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="text"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="number"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            maxLength="10"
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
              style={{ cursor: "pointer" }}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <div className="btn">
          <button type="submit" className="signup-btn">
            Register
          </button>
        </div>

        <p className="login-link">
          Already have an account?{" "}
          <span>
            <Link to="/login">Login</Link>
          </span>
        </p>
      </form>
    </div>
    </div>
  );
}

export default Signup;
