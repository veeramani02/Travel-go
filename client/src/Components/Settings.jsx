import React, { useEffect, useRef, useState } from "react";
import "../Styles/Settings.css";
import { FaLock } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import CustomizedSnackbars from "./CustomizedSnackbars";
import {
  getAvatarColor,
  sendEmail,
  sendSms,
  updateUser,
} from "../services/customerService";
import API_BASE_URL from "../config/api";
import { useNavigate } from "react-router-dom";

function Settings() {
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const { user, setUser } = useAuth();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const ProfileRef = useRef();
  const [profileFile, setProfileFile] = useState(null);
  const [oldData, setOldData] = useState(user);
  const navigate = useNavigate();

  useEffect(() => {
    if (ProfileRef.current) {
      ProfileRef.current.value = "";
    }
  }, []);

  useEffect(() => {
    return () => {
      if (profileImage) URL.revokeObjectURL(profileImage);
    };
  }, [profileImage]);

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
    if (profileImage) {
      URL.revokeObjectURL(profileImage);
    }
    setProfileFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    let imageurl = user?.profile;
    try {
      if (profileFile) {
        const data = new FormData();
        data.append("profileFile", profileFile);
        const res = await fetch(`${API_BASE_URL}/api/user/uploads`, {
          method: "POST",
          body: data,
          credentials: "include",
        });
        if (!res.ok) throw new Error("Upload failed");
        const result = await res.json();
        imageurl = result.profileUrl;
      }
      const finalData = { ...user, profile: imageurl };
      const isChanged = JSON.stringify(finalData) !== JSON.stringify(oldData);
      if (!isChanged) {
        setSnackbar((p) => ({
          ...p,
          open: true,
          message: "No changes made",
          severity: "info",
        }));
        return;
      }
      await updateUser(finalData._id, finalData);
      setUser({ ...finalData });
      setOldData({ ...finalData });
      setSnackbar({
        open: true,
        message: "Profile Updated Successfully",
        severity: "success",
      });
      if (finalData?.emailNotify)
        sendEmail(
          finalData?.email,
          "Account settings",
          `Hi ${finalData?.name}, your account settings have been updated.`,
        );
      if (finalData?.smsNotify)
        sendSms(
          finalData?.phone,
          `Hi ${finalData?.name}, your account settings have been updated.`,
        );
      return true;
    } catch (e) {
      setSnackbar({
        open: true,
        message: e.message,
        severity: "error",
      });
      return false;
    }
  };

  const handleCancel = () => {
    setUser(oldData);
    setProfileImage(null);
    setProfileFile(null);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const success = await handleSubmit();
    if (success) setIsEditing(true);
  };

  const getTimeAgo = (date) => {
    if (!date) return "not avaliable";

    const now = new Date();
    const past = new Date(date);

    const diff = Math.floor((now - past) / 1000);

    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);
    const months = Math.floor(diff / (86400 * 30));
    const years = Math.floor(diff / (86400 * 365));

    if (years > 0) return `${years} year(s) ago`;
    if (months > 0) return `${months} month(s) ago`;
    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} min(s) ago`;

    return "Just now";
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="title">System Settings</h1>
        <p>Configure your fleet management preferences.</p>
      </div>
      <div className="settings-card">
        <div className="edit-profile-div">
          <h2 className="card-title">Profile & Account</h2>
        </div>
        <div className="profile-section">
          <label htmlFor="avatarUpload">
            {profileImage ? (
              <img
                src={profileImage}
                className="profile-avatar"
                style={{
                  cursor: isEditing ? "not-allowed" : "pointer",
                }}
              />
            ) : user?.profile ? (
              <img
                src={user?.profile}
                alt="avatar"
                className="profile-avatar"
                onClick={() => {
                  if (!isEditing) ProfileRef.current.click();
                }}
                style={{
                  cursor: isEditing ? "not-allowed" : "pointer",
                }}
              />
            ) : (
              <div
                className="settings-user-image-no-div"
                style={{
                  background: getAvatarColor(user?.name),
                  cursor: isEditing ? "not-allowed" : "pointer",
                  opacity: isEditing ? 0.6 : 1,
                }}
                onClick={() => {
                  if (!isEditing) ProfileRef.current.click();
                }}
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
            disabled={isEditing}
            onChange={handleImageChange}
          />

          <div
            className="avatar-text"
            style={{
              cursor: isEditing ? "not-allowed" : "pointer",
            }}
          >
            <button
              className="settings-user-profile-button"
              style={{
                cursor: isEditing ? "not-allowed" : "pointer",
                background: isEditing ? "gray" : "",
              }}
              disabled={isEditing}
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
              disabled={isEditing}
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
            <input
              type="checkbox"
              name="emailNotify"
              checked={user?.emailNotify || false}
              onChange={handleInputChange}
              disabled={isEditing}
            />
            <span
              className="slider"
              style={{
                cursor: isEditing ? "not-allowed" : "pointer",
                opacity: isEditing ? 0.6 : 1,
              }}
            ></span>
          </label>
        </div>

        <div className="notification-item">
          <div>
            <h4>Push Notifications</h4>
            <p>Get real-time updates on mobile devices.</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              name="pushNotify"
              checked={user?.pushNotify || false}
              onChange={handleInputChange}
              disabled={isEditing}
            />
            <span
              className="slider"
              style={{
                cursor: isEditing ? "not-allowed" : "pointer",
                opacity: isEditing ? 0.6 : 1,
              }}
            ></span>
          </label>
        </div>

        <div className="notification-item">
          <div>
            <h4>SMS Alerts</h4>
            <p>Get SMS updates for pending details.</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              name="smsNotify"
              checked={user?.smsNotify || false}
              onChange={handleInputChange}
              disabled={isEditing}
            />
            <span
              className="slider"
              style={{
                cursor: isEditing ? "not-allowed" : "pointer",
                opacity: isEditing ? 0.6 : 1,
              }}
            ></span>
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
              <p className="settings-caption">
                Last changed {getTimeAgo(user?.passwordChangedAt)}
              </p>
            </div>
          </div>

          <p
            className="link-btn"
            style={{
              cursor: isEditing ? "not-allowed" : "pointer",
              opacity: isEditing ? 0.6 : 1,
            }}
            onClick={() => {
              if (isEditing) return;
              navigate("changepassword");
            }}
          >
            Change
          </p>
        </div>

        <div className="security-item">
          <div className="security-left">
            <MdSecurity className="security-icon" />

            <div>
              <h4>Two-Factor Authentication</h4>
              <p className="settings-caption">Add an extra layer of security</p>
            </div>
          </div>

          <p
            className="link-btn"
            onClick={() => {
              if (isEditing) return;
              setUser((u) => ({
                ...u,
                twoStepVerification: !u.twoStepVerification,
              }));
            }}
            style={{
              cursor: isEditing ? "not-allowed" : "pointer",
              opacity: isEditing ? 0.6 : 1,
            }}
          >
            {user?.twoStepVerification ? "Enabled" : "Disabled"}
          </p>
        </div>
      </div>

      <div className="settings-actions">
        <button className="cancel-btn" onClick={() => handleCancel()}>
          Cancel
        </button>

        {!isEditing ? (
          <button className="settings-save-btn" onClick={() => handleSave()}>
            Save Changes
          </button>
        ) : (
          <button
            type="button"
            className="settings-save-btn"
            onClick={() => setIsEditing((p) => !p)}
          >
            <FaRegEdit /> Edit
          </button>
        )}
      </div>
      <CustomizedSnackbars
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}

export default Settings;
