import React, { useEffect, useRef, useState } from "react";
import "../Styles/Settings.css";
import { FaLock } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import CustomizedSnackbar from "./CustomizedSnackbars";
import { getAvatarColor } from "../services/customerService";

function Settings() {
  const [profileImage, setProfileImage] = useState(null);
  const [editProfile, setEditProfile] = useState(true);
  const { user, setUser } = useAuth();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const ProfileRef = useRef();
  const [profileFile, setProfileFile] = useState(null);

  useEffect(() => {
    ProfileRef.current.value = "";
  }, []);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        message: "File size must be less than 2MB",
        severity: "error",
      });
      ProfileRef.current.value = "";
      return;
    }
    setProfileFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    let imageurl = "";
    const data = new FormData();
    try {
      if (profileFile) {
        data.append("profileFile", profileFile);
        const res = await fetch(`http://localhost:${PORT}/api/user/uploads`, {
          method: "POST",
          body: data,
          credentials: "include",
        });
        if (!res.ok) throw { message: "Upload failed" };
        const result = await res.json();
        imageurl = result.profileUrl;
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>System Settings</h1>
        <p>Configure your fleet management preferences.</p>
      </div>

      <div className="settings-card">
        <div className="edit-profile-div">
          <h2 className="card-title">Profile & Account</h2>
          <button type="button" onClick={() => setEditProfile((p) => !p)}>
            <FaRegEdit /> Edit
          </button>
        </div>
        <div className="profile-section">
          <label htmlFor="avatarUpload">
            {profileImage ? (
              <img
                src={profileImage}
                alt="avatar"
                className="profile-avatar"
                onClick={() => ProfileRef.current.click()}
              />
            ) : (
              <div
                className="settings-user-image-no-div"
                style={{
                  background: getAvatarColor(user?.name),
                  cursor: editProfile ? "not-allowed" : "pointer",
                  opacity: editProfile ? "0.6" : "1",
                }}
                onClick={() => ProfileRef.current.click()}
              >
                <span>
                  {user?.name
                    ?.split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2) || "U"}
                </span>
              </div>
            )}
          </label>

          <input
            type="file"
            ref={ProfileRef}
            className="hidden-input"
            disabled={editProfile}
            onChange={handleImageChange}
          />

          <div
            className="avatar-text"
            style={{
              cursor: editProfile ? "not-allowed" : "pointer",
            }}
          >
            <button
              className="settings-user-profile-button"
              style={{
                cursor: editProfile ? "not-allowed" : "pointer",
                background: editProfile ? "gray" : "",
              }}
              disabled={editProfile}
              onClick={() => ProfileRef.current.click()}
            >
              Change Profile
            </button>
            <p>JPG, GIF or PNG. Max size of 2MB</p>
          </div>
        </div>

        <div className="profile-fields">
          <div className="field">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Admin User"
              disabled={editProfile}
              value={user?.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="admin@fleetpro.com"
              disabled={true}
              value={user?.email}
            />
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
        <button className=" settings-save-btn" onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
      <CustomizedSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}

export default Settings;
