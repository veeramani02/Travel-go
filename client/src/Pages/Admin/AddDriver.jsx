import React, { useState, useRef, useEffect } from "react";
import "../../Styles/AddDriver.css";
import { addDriver, VEHICLE_TYPES, PORT } from "../../services/driverService";
import { CgProfile } from "react-icons/cg";

export default function AddDriver({ openDriver, closeDriver }) {
  const [isOn, setIsOn] = useState(true);
  const [loading, setLoading] = useState(false);
  const Profileref = useRef();
  const LicenseRef = useRef();
  const [licenseFile, setLisenceFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    profile: "",
    vehicleType: "",
    licensePlate: "",
    drivingLicense: "",
    status: true,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    let imageurl = "";
    let licenseurl = "";
    const data = new FormData();
    try {
      if (profileFile) {
        data.append("profileFile", profileFile);
      }
      if (licenseFile) {
        data.append("licenseFile", licenseFile);
      }

      if (profileFile || licenseFile) {
        const res = await fetch(`http://localhost:${PORT}/api/driver/uploads`, {
          method: "POST",
          body: data,
          credentials: "include",
        });
        if (!res.ok) throw new Error("Upload failed");
        const result = await res.json();

        imageurl = result.profileUrl;
        licenseurl = result.licenseUrl;
      }

      const newData = {
        ...formData,
        profile: imageurl,
        license: licenseurl,
        status: isOn ? "Active" : "Inactive",
      };
       console.log(newData.profile, newData.license)
      await addDriver(newData);
      closeDriver(newData);
      resetForm();
      console.log(newData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLicenseFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 2MB");
      return;
    }
    setLisenceFile(file);
  };
  const handleProfileFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 2MB");
      return;
    }
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      profile: "",
      
      vehicleType: "",
      licensePlate: "",
      drivingLicense: "",
      status: true,
    });
    setProfilePreview(null);
    setProfileFile(null);
    setLisenceFile(null);
    setIsOn(true);
  };

  function handleRemoveProfileFile() {
    setProfilePreview(null);
    setProfileFile(null);
    if (profilePreview) URL.revokeObjectURL(profilePreview);
  }

  function handleRemoveLicenseFile() {
    setLisenceFile(null);
  }

  if (!openDriver) return null;
  return (
    <div className="addDriver-container">
      <div className="addDriver-body">
        <h1 className="addDriver-title">Add New Driver</h1>
        <p>Personal Details</p>
        <div className="personal-details">
          <div className="input">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="e.g John Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div className="input">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="e.g 987654321"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="input">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g JohnDoe@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="addDriver-upload-picture">
          <h3>Profile Picture</h3>
          <div className="driver-profile-picture-section">
            <div className="driver-profile-picture">
              <div className="addDriver-image">
                {profilePreview ? (
                  <img src={profilePreview} className="adddriverimage" />
                ) : (
                  <CgProfile className="adddriverimage" />
                )}
              </div>
              <div className="upload-button-div">
                <input
                  type="file"
                  id="pf"
                  name="pf"
                  ref={Profileref}
                  style={{ display: "none" }}
                  onChange={handleProfileFile}
                  accept="image/*"
                />
                <div className="upload-remove-container-div">
                  <button
                    className="addDriver-upload-button"
                    onClick={() => Profileref.current.click()}
                  >
                    Upload Profile
                  </button>
                  <button
                    className="addDriver-remove-button"
                    onClick={() => handleRemoveProfileFile()}
                  >
                    Remove
                  </button>
                </div>
                <p style={{ fontSize: "0.9rem", color: "gray" }}>
                  Recommended: Square image, max 2MB
                </p>
              </div>
            </div>
          </div>
        </div>
        <p>Vehicle Information</p>
        <div className="vehicle-details">
          <div className="input">
            <label htmlFor="vehicleType">Vehicle Type</label>
            <select
              name="vehicleType"
              id="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
            >
              <option value="">--Select--</option>
              {VEHICLE_TYPES.map((value, index) => (
                <option value={value} key={index}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="input">
            <label htmlFor="licensePlate">License Plate Number</label>
            <input
              type="text"
              id="licensePlate"
              name="licensePlate"
              placeholder="e.g TN-01-XXXX"
              value={formData.licensePlate}
              onChange={handleChange}
            />
          </div>
        </div>
        <p>Document & Status</p>
        <div className="document-info">
          <div className="input">
            <label htmlFor="dl">Driver License</label>
            <input
              type="file"
              id="dl"
              name="dl"
              ref={LicenseRef}
              style={{ display: "none" }}
              onChange={handleLicenseFile}
              accept="image/*"
            />
            <div className="upload-remove-container-div">
              <button onClick={() => LicenseRef.current.click()}>
                Upload File
              </button>
              <button
                className="addDriver-remove-button"
                onClick={() => handleRemoveLicenseFile()}
              >
                Remove
              </button>
            </div>
            {licenseFile && (
              <p
                style={{ display: "inline-block", marginTop: "10px" }}
                className="file-content"
                title={licenseFile}
              >
                {licenseFile.name}
              </p>
            )}
          </div>
          <div className="input">
            <label htmlFor="status">Status</label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                id="status"
                onClick={() => setIsOn(!isOn)}
                style={{
                  width: "46px",
                  height: "24px",
                  borderRadius: "50px",
                  backgroundColor: isOn ? "var(--primary)" : "#ccc",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    position: "absolute",
                    top: "3px",
                    left: isOn ? "25px" : "3px",
                    transition: "left 0.3s",
                  }}
                />
              </div>
              <span>Active/Inactive</span>
            </div>
          </div>
        </div>
        <div className="btn-div">
          <div className="btn">
            <button
              onClick={() => {
                closeDriver(null);
                resetForm();
              }}
            >
              Cancel
            </button>
          </div>
          <div className="btn">
            <button
              disabled={loading}
              onClick={() => {
                handleSubmit();
              }}
            >
              {loading ? "Adding..." : "Add Driver"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
