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
     

      <div className="preferences-card">

         <h1 >Trip Preferences</h1>


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