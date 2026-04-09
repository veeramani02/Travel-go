import React, { useState, useRef, useEffect } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { State, City } from "country-state-city";
import "../../Styles/BookTrip.css";

function BookTrip() {
  const navigate = useNavigate();
  const inputRefs = useRef({});
  const phoneRegex = /^[6-9]\d{9}$/;

  const [errors, setErrors] = useState({});

  const [pickupStates, setPickupStates] = useState([]);
  const [pickupCities, setPickupCities] = useState([]);

  const [destinationStates, setDestinationStates] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);

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
    specialRequest: "",
    driverId: "",
    vehicleId: "",
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

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

    if (!formData.pickupState)
      validationErrors.pickupState = "Select pickup state.";
    if (!formData.pickupCity)
      validationErrors.pickupCity = "Select pickup city.";
    if (!formData.destinationState)
      validationErrors.destinationState = "Select destination state.";
    if (!formData.destinationCity)
      validationErrors.destinationCity = "Select destination city.";

    const selectedDate = new Date(formData.travelDate);
    if (isNaN(selectedDate.getTime()) || selectedDate <= new Date()) {
      validationErrors.travelDate = "Select future date & time.";
    }

    if (!formData.vehicleType)
      validationErrors.vehicleType = "Select vehicle type.";
    if (!formData.passengers || parseInt(formData.passengers) <= 0) {
      validationErrors.passengers = "Minimum 1 passenger required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/trip/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          dateAndTime: formData.travelDate,
        }),
      });

      const data = await response.json();

      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Trip creation failed");
      }

      const tripId = data.trip._id;

      console.log("Trip Created:", tripId);

      //  send tripId to payment page
      navigate("/customer/payment", { state: { tripId } });
    } catch (error) {
      console.error("ERROR:", error);
      alert(error.message);
    }
  };
  const renderError = (field) =>
    errors[field] ? (
      <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="booktrip-page">
      <form className="booktrip-form" onSubmit={handleSubmit} noValidate>
        <h1 className="booktrip-title">
          Plan Your <span>Journey</span>
        </h1>

        <div className="booktrip-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {renderError("name")}
        </div>

        <div className="booktrip-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {renderError("phone")}
        </div>

        <div className="booktrip-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {renderError("email")}
        </div>

        {/* Pickup */}
        <div className="booktrip-group">
          <label>Pickup State</label>
          <select
            value={formData.pickupState}
            onChange={handlePickupStateChange}
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

        <div className="booktrip-group">
          <label>Pickup City</label>
          <select
            name="pickupCity"
            value={formData.pickupCity}
            onChange={handleChange}
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
        <div className="booktrip-group">
          <label>Destination State</label>
          <select
            value={formData.destinationState}
            onChange={handleDestinationStateChange}
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

        <div className="booktrip-group">
          <label>Destination City</label>
          <select
            name="destinationCity"
            value={formData.destinationCity}
            onChange={handleChange}
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

        <div className="booktrip-group">
          <label>Date & Time</label>
          <input
            type="datetime-local"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
          />
          {renderError("travelDate")}
        </div>

        <div className="booktrip-group">
          <label>Vehicle Type</label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
          >
            <option value="">Select Vehicle</option>
            <option value="Car">Car</option>
            <option value="Van">Van</option>
            <option value="Bus">Bus</option>
          </select>
          {renderError("vehicleType")}
        </div>

        <div className="booktrip-group">
          <label>Passengers</label>
          <input
            type="number"
            name="passengers"
            value={formData.passengers}
            onChange={handleChange}
          />
          {renderError("passengers")}
        </div>

        <div className="booktrip-group">
          <label>Special Request</label>
          <textarea
            name="specialRequest"
            rows={4}
            value={formData.specialRequest}
            onChange={handleChange}
          />
        </div>

        <button className="booktrip-btn" type="submit">
          Proceed to Payment
        </button>
      </form>
    </div>
  );
}

export default BookTrip;
