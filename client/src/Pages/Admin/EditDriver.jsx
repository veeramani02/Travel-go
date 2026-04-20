import React, { useState, useEffect, useRef } from "react";
import "../../Styles/EditDriver.css";
import {
  getAvatarColor,
  VEHICLE_TYPES,
} from "../../services/driverService";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";
import { State, City } from "country-state-city";
import API_BASE_URL from "../../config/api";

export default function EditDriver({ Open, Close, Data, Onsave }) {
  const Profileref = useRef();
  const LicenseRef = useRef();
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [state, setState] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
    };
  }, [profilePreview]);

  useEffect(() => {
    if (Data) {
      setFormData({
        _id: Data._id,
        name: Data.name,
        phone: Data.phone,
        email: Data.email,
        profile: Data.profile,
        status: Data.status,
        vehicleType: Data.vehicleType,
        vehicleNo: Data.vehicleNo,
        license: Data.license,
        vehicleColor: Data.vehicleColor,
        state: Data.state,
        city: Data.city,
      });
    }
    const cities = City.getCitiesOfState("IN", Data.state);
    setCities(cities);
  }, [Data]);

  useEffect(() => {
    if (snackbar) {
      setSnackbar({
        open: false,
        message: "",
        severity: "success",
      });
    }
  }, [Open]);

  useEffect(() => {
    const indiaStates = State.getStatesOfCountry("IN");
    setState(indiaStates);
  }, []);

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

  const handleProfileFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        message: "File size must be less than 2MB",
        severity: "info",
      });
      return;
    }
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  function handleRemoveProfileFile() {
    setProfilePreview(null);
    setProfileFile(null);
    setFormData((prev) => ({
      ...prev,
      profile: "",
    }));
    if (Profileref.current) {
      Profileref.current.value = "";
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const data = new FormData();
      let profileurl = "";
      let licenseurl = "";
      if (profileFile) {
        data.append("profileFile", profileFile);
      }

      if (profileFile) {
        const res = await fetch(`${API_BASE_URL}/api/driver/uploads`, {
          method: "POST",
          body: data,
          credentials: "include",
        });
        if (!res.ok) throw { message: "upload failed" };
        const result = await res.json();
        profileurl = result.profileUrl;
        licenseurl = result.licenseUrl;
      }
      const newData = {
        ...formData,
        profile: profileurl || formData.profile,
        license: licenseurl || formData.license,
      };
      await Onsave(newData);
      Close();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  function handleClose() {
    Close();
  }

  if (!Open || !Data) return null;
  return (
    <div className="editdriver-container-div">
      <div className="editdriver-container">
        <form onSubmit={handleSubmit}>
          <h1>Edit Driver Profile</h1>
          <h3>Driver Info</h3>
          <div className="editdriver-input">
            <div className="editdriver-photo-div">
              <div>
                {profilePreview ? (
                  <img src={profilePreview} className="driver-image-no-div" />
                ) : formData.profile ? (
                  <img
                    src={formData.profile}
                    alt=""
                    className="driver-image-no-div"
                  />
                ) : (
                  <div
                    style={{ backgroundColor: getAvatarColor(formData?.name) }}
                    className="driver-image-no-div"
                  >
                    <span>
                      {formData?.name
                        ?.split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>
              <div className="editdriver-upload-remove-button">
                <input
                  type="file"
                  id="pf"
                  name="pf"
                  ref={Profileref}
                  style={{ display: "none" }}
                  onChange={handleProfileFile}
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={() => Profileref.current.click()}
                >
                  Upload
                </button>
                <button type="button" onClick={() => handleRemoveProfileFile()}>
                  Remove
                </button>
              </div>
            </div>
          </div>
          <div className="editdriver-input">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="editdriver-input">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
            />
          </div>
          <div className="editdriver-input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </div>
          <div className="editdriver-input">
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
          <div className="editdriver-input">
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
          <div className="editdriver-input">
            <label htmlFor="status">Status</label>
            <select
              name="status"
              id="status"
              value={formData.status || ""}
              onChange={handleChange}
            >
              <option value="">--select--</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Trip">On Trip</option>
            </select>
          </div>
          <h3>Vehicle Info</h3>
          <div className="editdriver-input">
            <label htmlFor="vehicleType">Vehicle Type</label>
            <select
              name="vehicleType"
              id="vehicleType"
              value={formData.vehicleType || ""}
              onChange={handleChange}
            >
              <option value="">Not selected</option>
              {VEHICLE_TYPES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="editdriver-input">
            <label htmlFor="vehicleNo">Vehicle No</label>
            <input
              type="text"
              name="vehicleNo"
              id="vehicleNo"
              value={formData.vehicleNo || ""}
              onChange={handleChange}
              disabled={!formData.vehicleType ? true : false}
            />
          </div>
          <div className="editdriver-input">
            <label htmlFor="vehicleColor">vehicle Color</label>
            <input
              type="text"
              name="vehicleColor"
              id="vehicleColor"
              value={formData.vehicleColor || ""}
              onChange={handleChange}
              disabled={!formData.vehicleType ? true : false}
            />
          </div>
          <div className="editdriver-button-div">
            <button type="submit">Save</button>
            <button type="button" onClick={() => handleClose()}>
              Close
            </button>
          </div>
        </form>
      </div>
      <CustomizedSnackbars
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </div>
  );
}
