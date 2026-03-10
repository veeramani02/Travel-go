
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { State, City } from "country-state-city";
import "../../Styles/NewBooking.css";

function NewBooking({Open, Close}) {
  const navigate = useNavigate();
  const phoneRegex = /^[6-9]\d{9}$/;

  const [errors, setErrors] = useState({});

  const [pickupStates, setPickupStates] = useState([]);
  const [pickupCities, setPickupCities] = useState([]);

  const [destinationStates, setDestinationStates] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    pickupState: "",
    pickupCity: "",
    destinationState: "",
    destinationCity: "",
    travelDate: "",
    vehicleType: "",
    passengers: "",
    AssignedDriver: "",
    specialRequest: "",
  });

  useEffect(() => {
    const indiaStates = State.getStatesOfCountry("IN");
    setPickupStates(indiaStates);
    setDestinationStates(indiaStates);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handlePickupStateChange = (e) => {
    const stateCode = e.target.value;

    setFormData({
      ...formData,
      pickupState: stateCode,
      pickupCity: "",
    });

    const cities = City.getCitiesOfState("IN", stateCode);
    setPickupCities(cities);
  };

  const handleDestinationStateChange = (e) => {
    const stateCode = e.target.value;

    setFormData({
      ...formData,
      destinationState: stateCode,
      destinationCity: "",
    });

    const cities = City.getCitiesOfState("IN", stateCode);
    setDestinationCities(cities);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};
    
    if(isEdit){
        if (formData.name.trim().length < 3) {
        validationErrors.name = "Name must be at least 3 characters.";
        }

        if (!phoneRegex.test(formData.phone)) {
        validationErrors.phone = "Invalid Phone Number.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
        validationErrors.email = "Please enter valid email.";
        }

        if (!formData.pickupState) {
        validationErrors.pickupState = "Select pickup state.";
        }

        if (!formData.pickupCity) {
        validationErrors.pickupCity = "Select pickup city.";
        }

        if (!formData.destinationState) {
        validationErrors.destinationState = "Select destination state.";
        }

        if (!formData.destinationCity) {
        validationErrors.destinationCity = "Select destination city.";
        }

        const selectedDate = new Date(formData.travelDate);
        if (isNaN(selectedDate.getTime()) || selectedDate <= new Date()) {
        validationErrors.travelDate = "Select future date & time.";
        }

        if (!formData.vehicleType) {
        validationErrors.vehicleType = "Select vehicle type.";
        }

        if(!formData.AssignedDriver){
            validationErrors.AssignedDriver = "Assign Driver."
        }

        if (!formData.passengers || parseInt(formData.passengers) <= 0) {
        validationErrors.passengers = "Minimum 1 passenger required.";
        }

        if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
        }
    }else setErrors("")
    
    localStorage.setItem(
      "pendingTrip",
      JSON.stringify({
        ...formData,
        status: "Pending",
        createdAt: new Date().toISOString(),
      })
    );
  };

  const renderError = (field) =>
    errors[field] ? (
      <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
        {errors[field]}
      </p>
    ) : null;
  if(!Open) return null;
  return (
    <div className="newbooking-container">
    <div className="Newbooking-page">
      <form className="Newbooking-form" onSubmit={handleSubmit} noValidate>
        <div className="Newbooking-title-div">
        <h1 className="Newbooking-title">
          Booking Details
        </h1>
        <button onClick={()=>setIsEdit(prev => !prev)}>Edit</button>
        </div>

        <div className="Newbooking-group">
          <label>Customer Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEdit}
          />
          {renderError("name")}
        </div>

        <div className="Newbooking-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEdit}
          />
          {renderError("phone")}
        </div>

        <div className="Newbooking-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEdit}
          />
          {renderError("email")}
        </div>

        {/* Pickup */}
        <div className="Newbooking-group">
          <label>Pickup State</label>
          <select
            value={formData.pickupState}
            onChange={handlePickupStateChange}
            disabled={!isEdit}
          >
            <option value="">Select State</option>
            {pickupStates.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
          {renderError("pickupState")}
        </div>

        <div className="Newbooking-group">
          <label>Pickup City</label>
          <select
            name="pickupCity"
            value={formData.pickupCity}
            onChange={handleChange}
            disabled={!isEdit}
          >
            <option value="">Select City</option>
            {pickupCities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {renderError("pickupCity")}
        </div>

        {/* Destination */}
        <div className="Newbooking-group">
          <label>Destination State</label>
          <select
            value={formData.destinationState}
            onChange={handleDestinationStateChange}
            disabled={!isEdit}
          >
            <option value="">Select State</option>
            {destinationStates.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
          {renderError("destinationState")}
        </div>

        <div className="Newbooking-group">
          <label>Destination City</label>
          <select
            name="destinationCity"
            value={formData.destinationCity}
            onChange={handleChange}
            disabled={!isEdit}
          >
            <option value="">Select City</option>
            {destinationCities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {renderError("destinationCity")}
        </div>

        <div className="Newbooking-group">
          <label>Date & Time</label>
          <input
            type="datetime-local"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            disabled={!isEdit}
          />
          {renderError("travelDate")}
        </div>

        <div className="Newbooking-group">
          <label>Vehicle Type</label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            disabled={!isEdit}
          >
            <option value="">Select Vehicle</option>
            <option value="Car">Car</option>
            <option value="Van">Van</option>
            <option value="Bus">Bus</option>
          </select>
          {renderError("vehicleType")}
        </div>

        <div className="Newbooking-group">
          <label>Passengers</label>
          <input
            type="number"
            name="passengers"
            value={formData.passengers}
            onChange={handleChange}
            disabled={!isEdit}
          />
          {renderError("passengers")}
        </div>

        <div className="Newbooking-group">
          <label>Assigned Driver</label>
          <input
            type="text"
            name="assigneddriver"
            value={formData.AssignedDriver}
            onChange={handleChange}
            disabled={!isEdit}
          />
          {renderError("AssignedDriver")}
        </div>

        <div className="Newbooking-group" style={{ display: isEdit ? "none" : "" }}>
          <label>Special Request</label>
          <textarea
            name="specialRequest"
            rows={4}
            value={formData.specialRequest}
            onChange={handleChange}
            disabled={true}
          />
        </div>
        <div className="Newbooking-button-div">
        <button className="Newbooking-btn" type="submit" onClick={Close}>
          Save
        </button>
        <button className="Newbooking-btn" onClick={Close}>
          Close
        </button>
        </div>
      </form>
    </div>
   </div>
  );
}

export default NewBooking;