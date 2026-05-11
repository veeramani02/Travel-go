import React, { useState, useRef, useEffect } from "react";
import "../../Styles/AddDriver.css";
import { addDriver, VEHICLE_TYPES } from "../../services/driverService";
import { CgProfile } from "react-icons/cg";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";
import { State, City } from "country-state-city";
import API_BASE_URL from "../../config/api";

export default function AddDriver({ openDriver, closeDriver }) {
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
    password: "",
    profile: "",
    vehicleType: "",
    vehicleNo: "",
    license: "",
    vehicleColor: "",
    state: "",
    city: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const indiaStates = State.getStatesOfCountry("IN");
    setState(indiaStates);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (!validateForm()) return;
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
        const res = await fetch(`${API_BASE_URL}/api/driver/uploads`, {
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
    setErrors((prev) => ({
      ...prev,
      license: "",
    }));
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
    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
    }

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
      password: "",
      profile: "",
      vehicleType: "",
      vehicleNo: "",
      license: "",
      vehicleColor: "",
      state: "",
      city: "",
    });
    setProfilePreview(null);
    setProfileFile(null);
    setLicenseFile(null);
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
    if (Profileref.current) {
      Profileref.current.value = "";
    }
  }

  function handleRemoveLicenseFile() {
    setLicenseFile(null);
    if (LicenseRef.current) {
      LicenseRef.current.value = "";
    }
  }

  function handlestateChange(e) {
    const state = e.target.value;

    setFormData((prev) => ({
      ...prev,
      state: state,
      city: "",
    }));

    setErrors((prev) => ({
      ...prev,
      state: "",
      city: "",
    }));

    const cities = City.getCitiesOfState("IN", state);
    setCities(cities);
  }

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    if (!formData.state) {
      newErrors.state = "Select state";
    }

    if (!formData.city) {
      newErrors.city = "Select city";
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = "Select vehicle type";
    }

    if (!formData.vehicleNo.trim()) {
      newErrors.vehicleNo = "Vehicle number required";
    }

    if (!formData.vehicleColor.trim()) {
      newErrors.vehicleColor = "Vehicle color required";
    }

    if (!licenseFile) {
      newErrors.license = "Upload license file";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() ? "" : "Name is required";

      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^[6-9]\d{9}$/.test(value)) {
          return "Enter valid phone number";
        }
        return "";

      case "email":
        if (!value.trim()) return "Email is required";

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          return "Invalid email address";
        }

        return "";

      case "password":
        if (!value.trim()) return "Password is required";

        if (value.length < 6) {
          return "Minimum 6 characters required";
        }

        return "";

      default:
        return "";
    }
  };

  if (!openDriver) return null;
  return (
    <div className="addDriver-container">
      <div className="addDriver-body">
        <h1 className="addDriver-title">Add New Driver</h1>
        <p>Personal Details</p>
        <div className="personal-details">
          <div className="details">
            <div className="input">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="ad-error">{errors.name}</span>}
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
              {errors.phone && <span className="ad-error">{errors.phone}</span>}
            </div>
          </div>
          <div className="validation">
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
              {errors.email && <span className="ad-error">{errors.email}</span>}
            </div>

            <div className="input">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="ad-error">{errors.password}</span>
              )}
            </div>
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
                {errors.state && (
                  <span className="ad-error">{errors.state}</span>
                )}
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
                {errors.city && <span className="ad-error">{errors.city}</span>}
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
            {errors.vehicleType && (
              <span className="ad-error">{errors.vehicleType}</span>
            )}
          </div>
          <div className="input">
            <label htmlFor="vehicleNo">Vehicle No</label>
            <input
              type="text"
              id="vehicleNo"
              name="vehicleNo"
              placeholder="e.g TN-01-XXXX"
              value={formData.vehicleNo}
              onChange={handleChange}
              disabled={!formData.vehicleType ? true : false}
            />
            {errors.vehicleNo && (
              <span className="ad-error">{errors.vehicleNo}</span>
            )}
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
            {errors.vehicleColor && (
              <span className="ad-error">{errors.vehicleColor}</span>
            )}
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
              {errors.license && (
                <span className="ad-error">{errors.license}</span>
              )}
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
