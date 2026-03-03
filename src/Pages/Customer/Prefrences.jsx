import React, { useState, useEffect } from "react";
import "../../Styles/Prefrence.css"
function Preferences() {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    preferredVehicle: "",
    preferredDriver: ""
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userProfile"));
    if (stored) {
      setProfile(stored);
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Preferences Updated Successfully ");
  };

  return (
    <div className="preferences-page">
      <h1 >Trip Preferences</h1>

      <div className="preferences-card">
{/* 
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input 
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input 
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
        </div> */}

        {/* <hr /> */}

        <div className="form-group">
          <label>Preferred Vehicle</label>
          <select 
            name="preferredVehicle"
            value={profile.preferredVehicle}
            onChange={handleChange}
          >
            <option value="">Select Vehicle</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Van">Van</option>
          </select>
        </div>

        <div className="form-group">
          <label>Preferred Driver</label>
          <select 
            name="preferredDriver"
            value={profile.preferredDriver}
            onChange={handleChange}
          >
            <option value="">Select Driver</option>
            <option value="Driver A">Driver A</option>
            <option value="Driver B">Driver B</option>
            <option value="Driver C">Driver C</option>
          </select>
        </div>

        <button className="save-btn" onClick={handleSave}>
          Save Preferences
        </button>

      </div>
    </div>
  );
}

export default Preferences;