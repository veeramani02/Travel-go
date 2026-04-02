import React, { useState, useRef } from "react";
import "../Styles/vehicleModal.css";
import CustomizedSnackbars from "./CustomizedSnackbars";
import { PORT } from "../services/vehicleService";

function VehicleModal({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    vehicleType: "Sedan",
    vehicleModel: "",
    vehicleColor: "",
    year: "",
    vehicleNo: "",
    seatCapacity: "",
    luggageCapacity: "",
    fuelType: "Petrol",
    transmission: "Automatic",
    AC: false,
    frontView: "",
    sideView: "",
    interior: "",
    backView: "",
    status: "Available",
    document: "",
    policyNo: "",
  });
  const [showUpload, setShowUpload] = useState(false);
  const [frontPreview, setFrontPreview] = useState(null);
  const [sidePreview, setSidePreview] = useState(null);
  const [interiorPreview, setInteriorPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [error, setError] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [imageFile, setImageFile] = useState({
    front: "",
    side: "",
    interior: "",
    back: "",
    document: "",
  });
  const frontRef = useRef();
  const sideRef = useRef();
  const interiorRef = useRef();
  const backRef = useRef();
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];

    if (!file) return;
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        message: "File size must be less than 2MB",
        severity: "error",
      });
      switch (type) {
        case "front":
          frontRef.current.value = "";
          break;
        case "side":
          sideRef.current.value = "";
          break;
        case "interior":
          interiorRef.current.value = "";
          break;
        case "back":
          backRef.current.value = "";
          break;
        default:
          break;
      }
      return;
    }

    const previewURL = URL.createObjectURL(file);

    switch (type) {
      case "front":
        setFrontPreview(previewURL);
        setImageFile((pre) => ({ ...pre, front: file }));
        break;
      case "side":
        setSidePreview(previewURL);
        setImageFile((pre) => ({ ...pre, side: file }));
        break;
      case "interior":
        setInteriorPreview(previewURL);
        setImageFile((pre) => ({ ...pre, interior: file }));
        break;
      case "back":
        setBackPreview(previewURL);
        setImageFile((pre) => ({ ...pre, back: file }));
        break;
      default:
        break;
    }
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    console.log(formData);
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    let frontUrl = "",
      sideUrl = "",
      interiorUrl = "",
      backUrl = "";
    const Data = new FormData();
    try {
      if (imageFile.front) Data.append("frontViewFile", imageFile.front);
      if (imageFile.side) Data.append("sideViewFile", imageFile.side);
      if (imageFile.interior)
        Data.append("interiorViewFile", imageFile.interior);
      if (imageFile.back) Data.append("backViewFile", imageFile.back);
      if (imageFile.documentFile)
        Data.append("documentFile", imageFile.document);

      if (
        imageFile.front ||
        imageFile.side ||
        imageFile.interior ||
        imageFile.back
      ) {
        const res = await fetch(
          `http://localhost:${PORT}/api/vehicle/uploads`,
          {
            method: "POST",
            body: Data,
            credentials: "include",
          },
        );
        if (!res.ok) throw { message: "Upload failed" };
        const result = await res.json();
        console.log("from api uploads", result);
        frontUrl = result.frontViewUrl;
        sideUrl = result.sideViewUrl;
        interiorUrl = result.interiorViewUrl;
        backUrl = result.backViewUrl;
      }

      const newData = {
        ...formData,
        frontView: frontUrl || "",
        sideView: sideUrl || "",
        interior: interiorUrl || "",
        backView: backUrl || "",
      };
      console.log(newData);
      onSave(newData);
    } catch (e) {
      console.log(e.message);
    }
  };
  const validateForm = () => {
    let newErrors = {};

    if (formData.vehicleModel.trim() === "") {
      newErrors.vehicleModel = "vehicleModel is required";
    }

    if (formData.vehicleType.trim() === "") {
      newErrors.vehicleType = "vehicleNo plate is required";
    }

    if (formData.seatCapacity === "") {
      newErrors.seatCapacity = "Passenger capacity required";
    }

    if (formData.luggageCapacity.trim() === "") {
      newErrors.luggageCapacity = "luggageCapacity capacity required";
    }
    if (formData.vehicleColor.trim() === "") {
      newErrors.vehicleColor = "vehicleColor of vehicle is required";
    }
    if (formData.year.trim() === "") {
      newErrors.year = "year of manufacturer is required";
    }
    if (formData.policyNo.trim() === "") {
      newErrors.policyNo = "policyNo policy Number is required";
    }
    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  return (
    <div className="vehicle-modal">
      <div className="vehicle-form-large">
        <h2>Add New Vehicle</h2>

        {/* BASIC INFORMATION */}

        <h3>Basic Information</h3>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="vehicleType">Vehicle Type</label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
            >
              <option>Sedan</option>
              <option>SUV</option>
              <option>Van</option>
              <option>Minibus</option>
              <option>Luxury Coach</option>
            </select>
          </div>

          <div className="form-field">
            <label>vehicleModel</label>
            <input
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              placeholder="Toyota Hiace"
            />

            {error.vehicleModel && (
              <p className="error-text">{error.vehicleModel}</p>
            )}
          </div>

          <div className="form-field">
            <label>Vehicle Color</label>

            <div className="color-field">
              <input
                type="text"
                name="vehicleColor"
                value={formData.vehicleColor}
                onChange={handleChange}
                placeholder="Type vehicle color"
              />
              {error.vehicleColor && (
                <p className="error-text">{error.vehicleColor}</p>
              )}
            </div>
          </div>

          <div className="form-field">
            <label>Year of Manufacture</label>
            <input
              type="month"
              name="year"
              value={formData.year}
              onChange={handleChange}
            />
            {error.year && <p className="error-text">{error.year}</p>}
          </div>

          <div className="form-field">
            <label>Vehicle no</label>
            <input
              name="vehicleNo"
              value={formData.vehicleNo}
              onChange={handleChange}
            />
            {error.vehicleNo && <p className="error-text">{error.vehicleNo}</p>}
          </div>
        </div>

        {/* VEHICLE SPECIFICATIONS */}

        <h3>Vehicle Specifications</h3>

        <div className="form-grid">
          <div className="form-field">
            <label>Passenger Capacity</label>
            <input
              type="number"
              name="seatCapacity"
              value={formData.seatCapacity}
              onChange={handleChange}
            />
            {error.seatCapacity && (
              <p className="error-text">{error.seatCapacity}</p>
            )}
          </div>

          <div className="form-field">
            <label>Luggage Capacity</label>
            <input
              name="luggageCapacity"
              value={formData.luggageCapacity}
              onChange={handleChange}
            />
            {error.luggageCapacity && (
              <p className="error-text">{error.luggageCapacity}</p>
            )}
          </div>

          <div className="form-field">
            <label>Fuel Type</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
            >
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Hybrid</option>
              <option>Electric</option>
            </select>
          </div>

          <div className="form-field">
            <label>Transmission</label>

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="transmission"
                  value="Automatic"
                  checked={formData.transmission === "Automatic"}
                  onChange={handleChange}
                />
                Automatic
              </label>

              <label>
                <input
                  type="radio"
                  name="transmission"
                  value="Manual"
                  checked={formData.transmission === "Manual"}
                  onChange={handleChange}
                />
                Manual
              </label>
            </div>

            <div className="ac-toggle">
              <label>Air Conditioning</label>

              <label className="switch">
                <input
                  type="checkbox"
                  name="AC"
                  checked={formData.AC}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>

              <span>{formData.AC ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>

        {/* VEHICLE IMAGES */}

        <h3>Vehicle Images</h3>

        <div className="vehicle-images">
          <div className="image-box">
            <label htmlFor="frontUpload" className="upload-label">
              {frontPreview ? (
                <img src={frontPreview} className="preview-img" />
              ) : (
                <span className="upload-text">Front View</span>
              )}
            </label>

            <input
              ref={frontRef}
              id="frontUpload"
              type="file"
              className="hidden-file"
              onChange={(e) => handleImageUpload(e, "front")}
            />
          </div>

          <div className="image-box">
            <label htmlFor="sideUpload" className="upload-label">
              {sidePreview ? (
                <img src={sidePreview} className="preview-img" />
              ) : (
                <span className="upload-text">Side View</span>
              )}
            </label>

            <input
              ref={sideRef}
              id="sideUpload"
              type="file"
              className="hidden-file"
              onChange={(e) => handleImageUpload(e, "side")}
            />
          </div>

          <div className="image-box">
            <label htmlFor="interiorUpload" className="upload-label">
              {interiorPreview ? (
                <img src={interiorPreview} className="preview-img" />
              ) : (
                <span className="upload-text">Interior</span>
              )}
            </label>

            <input
              ref={interiorRef}
              id="interiorUpload"
              type="file"
              className="hidden-file"
              onChange={(e) => handleImageUpload(e, "interior")}
            />
          </div>

          <div className="image-box">
            <label htmlFor="backUpload" className="upload-label">
              {backPreview ? (
                <img src={backPreview} className="preview-img" />
              ) : (
                <span className="upload-text">Back View</span>
              )}
            </label>

            <input
              ref={backRef}
              id="backUpload"
              type="file"
              className="hidden-file"
              onChange={(e) => handleImageUpload(e, "back")}
            />
          </div>
        </div>

        {/* STATUS */}

        <h3>Status & Documentation</h3>

        <div className="form-grid">
          <div className="form-field">
            <label>Current Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Available</option>
              <option>In Maintenance</option>
              <option>Out of Service</option>
            </select>
          </div>

          <div className="form-field">
            <label>Registration Documents</label>
            <input type="file" className="file-upload" />
          </div>

          <div className="form-field">
            <label>Insurance Policy Number</label>
            <input
              type="text"
              name="policyNo"
              value={formData.policyNo}
              onChange={handleChange}
            />
            {error.policyNo && (
              <p className="error-text">insurance policy number is required</p>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}

        <div className="form-actions">
          <button className="savevehicle-btn" onClick={handleSubmit}>
            Save Vehicle
          </button>

          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
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

export default VehicleModal;
