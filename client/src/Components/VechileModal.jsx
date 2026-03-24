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
const [showUpload, setShowUpload] = useState(false);
const [frontPreview,setFrontPreview] = useState(null);
const [sidePreview,setSidePreview] = useState(null);
const [interiorPreview,setInteriorPreview] = useState(null);
const [backPreview,setBackPreview] = useState(null);
const[error,setError]=useState({})
const handleImageUpload = (e,type) => {

const file = e.target.files[0];

if(!file) return;

const previewURL = URL.createObjectURL(file);

if(type==="front") setFrontPreview(previewURL);
if(type==="side") setSidePreview(previewURL);
if(type==="interior") setInteriorPreview(previewURL);
if(type==="back") setBackPreview(previewURL);

};
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };
const handleSubmit = () => {
    if(!validateForm()){
return;
}
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
const validateForm = () => {

let newErrors = {};

if(formData.model.trim() === ""){
newErrors.model = "Model is required";
}

if(formData.license.trim() === ""){
newErrors.license = "License plate is required";
}

if(formData.passengers === ""){
newErrors.passengers = "Passenger capacity required";
}

if(formData.luggage.trim() === ""){
newErrors.luggage = "Luggage capacity required";
}
if(formData.color.trim() === ""){
    newErrors.color="color of vehicle is required"
}
if(formData.year.trim()===""){
    newErrors.year="year of manufacturer is required"
}
if(formData.insurance.trim()===""){
    newErrors.insurance="Insurance policy Number is required"
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

{error.model && <p className="error-text">{error.model}</p>}
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
    {error.color && <p className="error-text">{error.color}</p>}
             
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
            <label>License Plate</label>
            <input
              name="license"
              value={formData.license}
              onChange={handleChange}
  
            />
            {error.license && <p className="error-text">{error.license}</p>}
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
            {error.passengers && <p className="error-text">{error.passengers}</p>}
          </div>

          <div className="form-field">
            <label>Luggage Capacity</label>
            <input
              name="luggage"
              value={formData.luggage}
              onChange={handleChange}
            />
            {error.luggage&&<p className="error-text">{error.luggage}</p>}
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

<div className="image-box">

<label htmlFor="frontUpload" className="upload-label">

{frontPreview ? (
  <img src={frontPreview} className="preview-img"/>
) : (
  <span className="upload-text">Front View</span>
)}

</label>

<input
id="frontUpload"
type="file"
className="hidden-file"
onChange={(e)=>handleImageUpload(e,"front")}
/>

</div>


<div className="image-box">

<label htmlFor="sideUpload" className="upload-label">

{sidePreview ? (
  <img src={sidePreview} className="preview-img"/>
) : (
  <span className="upload-text">Side View</span>
)}

</label>

<input
id="sideUpload"
type="file"
className="hidden-file"
onChange={(e)=>handleImageUpload(e,"side")}
/>

</div>


<div className="image-box">

<label htmlFor="interiorUpload"  className="upload-label">

{interiorPreview ?(
<img src={interiorPreview} className="preview-img"/>
):(
<span className="upload-text">Interior</span>
)}



</label>

<input
id="interiorUpload"
type="file"
className="hidden-file"
onChange={(e)=>handleImageUpload(e,"interior")}
/>

</div>


<div className="image-box">

<label htmlFor="backUpload"  className="upload-label">

{backPreview    ? (
<img src={backPreview} className="preview-img"/>
):(<span className="upload-text">Back View</span>)}



</label>

<input
id="backUpload"
type="file"
className="hidden-file"
onChange={(e)=>handleImageUpload(e,"back")}
/>

</div>
{/* 
<button className="add-img-btn">
Add More Images
</button> */}

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
    {error.insurance && <p className="error-text">insurance policy number is required</p>}
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