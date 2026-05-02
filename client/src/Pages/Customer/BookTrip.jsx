import React, { useState, useRef, useEffect } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { State, City } from "country-state-city";
import "../../Styles/BookTrip.css";
import API_BASE_URL from "../../config/api";

function BookTrip() {
  const navigate = useNavigate();
  const inputRefs = useRef({});
  const phoneRegex = /^[6-9]\d{9}$/;
  const [estimatedDuration, setEstimatedDuration] = useState(4);
  const [estimatedDistance, setEstimatedDistance] = useState(0);
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
//   const getCoordinates = async (city, state) => {
//   const response = await fetch(
//     `https://nominatim.openstreetmap.org/search?city=${city}&state=${state}&country=India&format=json&limit=1`
//   );

//   const data = await response.json();

//   if (!data.length) {
//     throw new Error(`Coordinates not found for ${city}`);
//   }

//   return {
//     lat: data[0].lat,
//     lon: data[0].lon,
//   };
// };
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let validationErrors = {};

//     if (formData.name.trim().length < 3) {
//       validationErrors.name = "Name must be at least 3 characters.";
//     }

//     if (!phoneRegex.test(formData.phone)) {
//       validationErrors.phone = "Invalid Phone Number.";
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       validationErrors.email = "Please enter valid email.";
//     }

//     if (!formData.pickupState)
//       validationErrors.pickupState = "Select pickup state.";
//     if (!formData.pickupCity)
//       validationErrors.pickupCity = "Select pickup city.";
//     if (!formData.destinationState)
//       validationErrors.destinationState = "Select destination state.";
//     if (!formData.destinationCity)
//       validationErrors.destinationCity = "Select destination city.";

//     const selectedDate = new Date(formData.travelDate);
//     if (isNaN(selectedDate.getTime()) || selectedDate <= new Date()) {
//       validationErrors.travelDate = "Select future date & time.";
//     }

//     if (!formData.vehicleType)
//       validationErrors.vehicleType = "Select vehicle type.";
//     if (!formData.passengers || parseInt(formData.passengers) <= 0) {
//       validationErrors.passengers = "Minimum 1 passenger required.";
//     }

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/api/trip/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           ...formData,
//           dateAndTime: formData.travelDate,
//         }),
//       });

//       const data = await response.json();

//       console.log("API Response:", data);

//       if (!response.ok) {
//         throw new Error(data.message || "Trip creation failed");
//       }

//       const tripId = data.trip._id;

//       console.log("Trip Created:", tripId);

   
//     navigate("/customer/payment", { state: { tripId } });

//   } catch (error) {
//     console.error("ERROR:", error);
//     alert(error.message);
//   }
// };
 // ONLY replace your handleSubmit function inside BookTrip.jsx
const getCoordinates = async (city, stateCode) => {
  const stateObj = State.getStateByCodeAndCountry(stateCode, "IN");
  const stateName = stateObj?.name || stateCode;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?city=${city}&state=${stateName}&country=India&format=json&limit=1`
  );

  const data = await response.json();

  if (!data.length) {
    throw new Error(`Coordinates not found for ${city}`);
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
};
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   let validationErrors = {};

//   if (formData.name.trim().length < 3) {
//     validationErrors.name = "Name must be at least 3 characters.";
//   }

//   if (!phoneRegex.test(formData.phone)) {
//     validationErrors.phone = "Invalid Phone Number.";
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(formData.email)) {
//     validationErrors.email = "Please enter valid email.";
//   }

//   if (!formData.pickupState)
//     validationErrors.pickupState = "Select pickup state.";

//   if (!formData.pickupCity)
//     validationErrors.pickupCity = "Select pickup city.";

//   if (!formData.destinationState)
//     validationErrors.destinationState = "Select destination state.";

//   if (!formData.destinationCity)
//     validationErrors.destinationCity = "Select destination city.";

//   const selectedDate = new Date(formData.travelDate);

//   if (isNaN(selectedDate.getTime()) || selectedDate <= new Date()) {
//     validationErrors.travelDate = "Select future date & time.";
//   }

//   if (!formData.vehicleType)
//     validationErrors.vehicleType = "Select vehicle type.";

//   if (!formData.passengers || parseInt(formData.passengers) <= 0) {
//     validationErrors.passengers = "Minimum 1 passenger required.";
//   }

//   if (Object.keys(validationErrors).length > 0) {
//     setErrors(validationErrors);
//     return;
//   }

//   try {
//     // GET PICKUP COORDINATES
//     const pickupCoords = await getCoordinates(
//       formData.pickupCity,
//       formData.pickupState
//     );

//     // GET DESTINATION COORDINATES
//     const destinationCoords = await getCoordinates(
//       formData.destinationCity,
//       formData.destinationState
//     );

//     // GET ROUTE DISTANCE + DURATION
//     const routeResponse = await fetch(
//       `${API_BASE_URL}/api/trip/route?start=${pickupCoords.lon},${pickupCoords.lat}&end=${destinationCoords.lon},${destinationCoords.lat}`
//     );

//     const routeData = await routeResponse.json();

//     let tripEstimatedDuration = 4; // fallback
//     let tripEstimatedDistance = 0;

//    if (
//   routeData.code === "Ok" &&
//   routeData.routes &&
//   routeData.routes.length > 0
// ) {
//   tripEstimatedDuration = routeData.routes[0].duration / 3600; // Hours
//   tripEstimatedDistance = routeData.routes[0].distance / 1000; // KM
// }

//     setEstimatedDuration(tripEstimatedDuration);
//     setEstimatedDistance(tripEstimatedDistance);

//     console.log("Estimated Duration:", tripEstimatedDuration);
//     console.log("Estimated Distance:", tripEstimatedDistance);

//     // CREATE TRIP
//     const response = await fetch(`${API_BASE_URL}/api/trip/create`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//       body: JSON.stringify({
//         ...formData,
//         dateAndTime: formData.travelDate,

//         estimatedDuration: tripEstimatedDuration,
//         estimatedDistance: tripEstimatedDistance,

//         pickupCoordinates: pickupCoords,
//         destinationCoordinates: destinationCoords,
//       }),
//     });

//     const data = await response.json();

//     console.log("API Response:", data);

//     if (!response.ok) {
//       throw new Error(data.message || "Trip creation failed");
//     }

//     const tripId = data.trip._id;

//     console.log("Trip Created:", tripId);

//     navigate("/customer/payment", {
//       state: {
//         tripId,
//         estimatedDuration: tripEstimatedDuration,
//         estimatedDistance: tripEstimatedDistance,
//       },
//     });
//   } catch (error) {
//     console.error("ERROR:", error);
//     alert(error.message);
//   }
// };
// FULL FIX — Replace ONLY getCoordinates + handleSubmit inside BookTrip.jsx

// REMOVE old getCoordinates completely and use this:
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
    // DIRECT CITY DATA FROM country-state-city PACKAGE
    const pickupCityData = pickupCities.find(
      (city) => city.name === formData.pickupCity
    );

    const destinationCityData = destinationCities.find(
      (city) => city.name === formData.destinationCity
    );

    if (!pickupCityData || !destinationCityData) {
      throw new Error("City coordinates not found");
    }

    const pickupCoords = {
      lat: parseFloat(pickupCityData.latitude),
      lon: parseFloat(pickupCityData.longitude),
    };

    const destinationCoords = {
      lat: parseFloat(destinationCityData.latitude),
      lon: parseFloat(destinationCityData.longitude),
    };

    console.log("Pickup Coordinates:", pickupCoords);
    console.log("Destination Coordinates:", destinationCoords);

    // ROUTE API
    const routeResponse = await fetch(
      `${API_BASE_URL}/api/trip/route?start=${pickupCoords.lon},${pickupCoords.lat}&end=${destinationCoords.lon},${destinationCoords.lat}`
    );

    const routeData = await routeResponse.json();

    console.log("Route Data:", routeData);

    let tripEstimatedDuration = 4; // fallback
    let tripEstimatedDistance = 0;

    if (
      routeData.code === "Ok" &&
      routeData.routes &&
      routeData.routes.length > 0
    ) {
      tripEstimatedDuration = routeData.routes[0].duration / 3600; // hrs
      tripEstimatedDistance = routeData.routes[0].distance / 1000; // km
    }

    setEstimatedDuration(tripEstimatedDuration);
    setEstimatedDistance(tripEstimatedDistance);

    console.log("Estimated Duration:", tripEstimatedDuration);
    console.log("Estimated Distance:", tripEstimatedDistance);

    // CREATE TRIP
    const response = await fetch(`${API_BASE_URL}/api/trip/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...formData,
        dateAndTime: formData.travelDate,

        estimatedDuration: tripEstimatedDuration,
        estimatedDistance: tripEstimatedDistance,

        pickupCoordinates: pickupCoords,
        destinationCoordinates: destinationCoords,
      }),
    });

    const data = await response.json();

    console.log("API Response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Trip creation failed");
    }

    const tripId = data.trip._id;

    navigate("/customer/payment", {
      state: {
        tripId,
        estimatedDuration: tripEstimatedDuration,
        estimatedDistance: tripEstimatedDistance,
      },
    });
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
