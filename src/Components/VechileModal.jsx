import React, { useState } from "react";
import "../Styles/vehicleModal.css";

function VehicleModal({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    type: "Sedan",
    model: "",
    color: "",
    year: "",
    license: "",
    passengers: "",
    luggage: "",
    fuel: "Petrol",
    transmission: "Automatic",
    airConditioning: false,
    status: "Available",
    insurance: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = () => {
    const newVehicle = {
      id: Date.now(),
      name: formData.model,
      number: formData.license,
      type: formData.type,
      status: formData.status,
      km: "0 Km",
      fuel: "100%",
      lastService: new Date().toISOString().split("T")[0],
      location: "Head Office"
    };

    onSave(newVehicle);
  };

  return (
    <div className="vehicle-modal">
      <div className="vehicle-form-large">
        <h2>Add New Vehicle</h2>

        {/* BASIC INFORMATION */}

        <h3>Basic Information</h3>

        <div className="form-grid">

          <div className="form-field">
            <label>Vehicle Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option>Sedan</option>
              <option>SUV</option>
              <option>Van</option>
              <option>Minibus</option>
              <option>Luxury Coach</option>
            </select>
          </div>

          <div className="form-field">
            <label>Make & Model</label>
            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Toyota Hiace"
            />
          </div>

          <div className="form-field">
            <label>Vehicle Color</label>

            <div className="color-field">
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Type color"
              />

             
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
          </div>

          <div className="form-field">
            <label>License Plate</label>
            <input
              name="license"
              value={formData.license}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* VEHICLE SPECIFICATIONS */}

        <h3>Vehicle Specifications</h3>

        <div className="form-grid">

          <div className="form-field">
            <label>Passenger Capacity</label>
            <input
              type="number"
              name="passengers"
              value={formData.passengers}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Luggage Capacity</label>
            <input
              name="luggage"
              value={formData.luggage}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Fuel Type</label>
            <select name="fuel" value={formData.fuel} onChange={handleChange}>
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
                  name="airConditioning"
                  checked={formData.airConditioning}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>

              <span>{formData.airConditioning ? "YES" : "NO"}</span>
            </div>

          </div>

        </div>

        {/* VEHICLE IMAGES */}

        <h3>Vehicle Images</h3>

        <div className="vehicle-images">
          <div className="image-box">Front View</div>
          <div className="image-box">Side View</div>
          <div className="image-box">Interior</div>
          <div className="image-box">Upload Image</div>

          <button className="add-img-btn">
            Add More Images
          </button>
        </div>

        {/* STATUS */}

        <h3>Status & Documentation</h3>

        <div className="form-grid">

          <div className="form-field">
            <label>Current Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
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
              name="insurance"
              value={formData.insurance}
              onChange={handleChange}
            />
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
    </div>
  );
}

export default VehicleModal;