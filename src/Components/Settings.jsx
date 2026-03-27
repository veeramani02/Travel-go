import React, { useState } from "react";
import "../Styles/Settings.css";
import { FaLock } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";

function Settings() {

  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="settings-page">

      
      <div className="settings-header">
        <h1>System Settings</h1>
        <p>Configure your fleet management preferences.</p>
      </div>

     
      <div className="settings-card">

        <h2 className="card-title">Profile & Account</h2>

        <div className="profile-section">

          <label htmlFor="avatarUpload">
            <img
              src={profileImage || "https://i.pravatar.cc/100"}
              alt="avatar"
              className="profile-avatar"
            />
          </label>

          <input
            type="file"
            id="avatarUpload"
            className="hidden-input"
            onChange={handleImageChange}
          />

         <label htmlFor="avatarUpload" className="avatar-text">
  <h4>Change Avatar</h4>
  <p>JPG, GIF or PNG. Max size of 800Kb</p>
</label>

        </div>

        <div className="profile-fields">

          <div className="field">
            <label>Full Name</label>
            <input type="text" placeholder="Admin User" />
          </div>

          <div className="field">
            <label>Email Address</label>
            <input type="email" placeholder="admin@fleetpro.com" />
          </div>

        </div>

      </div>

      <div className="settings-card">

        <h2 className="card-title">Notifications</h2>

        <div className="notification-item">

          <div>
            <h4>Email Notifications</h4>
            <p>Receive daily summaries and critical alerts via email.</p>
          </div>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>

        </div>

        <div className="notification-item">

          <div>
            <h4>Push Notifications</h4>
            <p>Get real-time updates on mobile devices.</p>
          </div>

          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>

        </div>

        <div className="notification-item">

          <div>
            <h4>SMS Alerts</h4>
            <p>Receive SMS for urgent driver issues.</p>
          </div>

          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>

        </div>

      </div>

   

      <div className="settings-card">

        <h2 className="card-title">Security</h2>

        <div className="security-item">

          <div className="security-left">

            <FaLock className="security-icon" />

            <div>
              <h4>Password</h4>
              <p>Last changed 3 months ago</p>
            </div>

          </div>

          <button className="link-btn">Change</button>

        </div>

        <div className="security-item">

          <div className="security-left">

            <MdSecurity className="security-icon" />

            <div>
              <h4>Two-Factor Authentication</h4>
              <p>Add an extra layer of security</p>
            </div>

          </div>

          <button className="link-btn">Enable</button>

        </div>

      </div>

      

      <div className="settings-actions">
        <button className="cancel-btn">Cancel</button>
        <button className=" settings-save-btn">Save Changes</button>
      </div>

    </div>
  );
}

export default Settings;