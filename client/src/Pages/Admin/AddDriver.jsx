import React, { useState, useRef, useEffect } from "react";
import "../../Styles/AddDriver.css";
import { addDriver, VEHICLE_TYPES, PORT } from "../../services/driverService";
import { CgProfile } from "react-icons/cg";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";
import { State, City } from "country-state-city";

export default function AddDriver({ openDriver, closeDriver }) {
  const [isOn, setIsOn] = useState(true);
  const [loading, setLoading] = useState(false);
  const Profileref = useRef();
  const LicenseRef = useRef();
  const [licenseFile, setLicenseFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [state, setState] = useState([]);
  const [cities, setCities] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    profile: "",
    vehicleType: "",
    vehicleNo: "",
    license: "",
    vehicleColor: "",
    status: "Active",
    state: "",
    city: "",
  });

  useEffect(() => {
    const indiaStates = State.getStatesOfCountry("IN");
    setState(indiaStates);
  }, []);

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
        if (!res.ok) throw { message: "Upload failed" };
        const result = await res.json();

        imageurl = result.profileUrl;
        licenseurl = result.licenseUrl;
      }

      const newData = {
        ...formData,
        profile: imageurl || formData.profile,
        license: licenseurl || formData.license,
        status: isOn ? "Active" : "Inactive",
      };
      await addDriver(newData);
      setSnackbar({
        open: true,
        message: "Driver added successfully",
        severity: "success",
      });
      closeDriver(newData);
      resetForm();
    } catch (err) {
      let message = "Something went wrong";
      if (typeof err === "string") {
        message = err;
      } else if (err?.general) {
        message = err.general;
      } else if (err && typeof err === "object") {
        message = Object.values(err)[0];
      }
      setSnackbar({
        open: true,
        message: message || "something went wrong",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLicenseFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        message: "File size must be less than 2MB",
        severity: "error",
      });
      LicenseRef.current.value = "";
      return;
    }
    setLicenseFile(file);
  };
  const handleProfileFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        message: "File size must be less than 2MB",
        severity: "error",
      });
      Profileref.current.value = "";
      return;
    }
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
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
      name: "",
      phone: "",
      email: "",
      profile: "",
      vehicleType: "",
      vehicleNo: "",
      license: "",
      vehicleColor: "",
      status: "Active",
      state: "",
      city: "",
    });
    setProfilePreview(null);
    setProfileFile(null);
    setLicenseFile(null);
    setIsOn(true);
    Profileref.current.value = "";
    LicenseRef.current.value = "";
    setSnackbar({
      open: false,
      message: "",
      severity: "success",
    });
  };

  function handleRemoveProfileFile() {
    setProfilePreview(null);
    setProfileFile(null);
    //if (profilePreview) URL.revokeObjectURL(profilePreview);
  }

  function handleRemoveLicenseFile() {
    setLicenseFile(null);
  }

  function handlestateChange(e) {
    const state = e.target.value;

    setFormData({
      ...formData,
      state: state,
      city: "",
    });
    const cities = City.getCitiesOfState("IN", state);
    setCities(cities);
  }

  if (!openDriver) return null;
  return (
    <div className="addDriver-container">
      <div className="addDriver-body">
        <h1 className="addDriver-title">Add New Driver</h1>
        <p>Personal Details</p>
        <div className="personal-details">
          <div className="input">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g John Doe"
              value={formData.name}
              onChange={handleChange}
              required
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
              required
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
                    type="button"
                    className="addDriver-upload-button"
                    onClick={() => Profileref.current.click()}
                  >
                    Upload Profile
                  </button>
                  <button
                    type="button"
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
            <div className="adddriver-location-details">
              <div className="input">
                <label htmlFor="state">State</label>
                <select
                  name="state"
                  id="state"
                  value={formData.state}
                  onChange={handlestateChange}
                >
                  <option value="">--select--</option>
                  {state.map((value, index) => (
                    <option value={value.isoCode} key={index}>
                      {value.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input">
                <label htmlFor="city">City</label>
                <select
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!formData.state ? true : false}
                >
                  <option value="">--select--</option>
                  {cities.map((value, index) => (
                    <option value={value.name} key={index}>
                      {value.name}
                    </option>
                  ))}
                </select>
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
            <label htmlFor="vehicleNo">Vehicle No</label>
            <input
              type="text"
              id="vehicleNo"
              name="vehicleNo"
              placeholder="e.g TN-01-XXXX"
              value={formData.licensePlate}
              onChange={handleChange}
              disabled={!formData.vehicleType ? true : false}
            />
          </div>
          <div className="input">
            <label htmlFor="vehicleColor">Vehicle Color</label>
            <input
              type="text"
              placeholder="e.g White"
              value={formData.vehicleColor}
              id="vehicleColor"
              name="vehicleColor"
              onChange={handleChange}
              disabled={!formData.vehicleType ? true : false}
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
              <button type="button" onClick={() => LicenseRef.current.click()}>
                Upload File
              </button>
              <button
                type="button"
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
              type="button"
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
              type="button"
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
      <CustomizedSnackbars
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </div>
  );
}
