import React, { useEffect, useState } from "react";
import "../../Styles/VehicleDetails.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function VehicleDetails() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

  const [vehicle, setVehicle] = useState(location.state);

  useEffect(() => {
    console.log(location.state);
  });

  const vehicleImages = {
    front: vehicle.frontView,
    side: vehicle.sideView,
    interior: vehicle.interior,
    back: vehicle.backView,
  };

  const [mainImage, setMainImage] = useState(vehicleImages.front);

  const handleChange = (e) => {
    setVehicle({
      ...vehicle,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="vehicleDetailsPage">
      <h2 className="vehicleDetailsTitle">
        Vehicle Details: {vehicle.vehicleModel} [{vehicle.vehicleNo}]
        <span className="vehicleStatusBadge">{vehicle.status}</span>
      </h2>

      <div className="vehicleDetailsContainer">
        {/* IMAGE SECTION */}

        <div className="vehicleImageSection">
          <div className="vehicleMainImage">
            <img src={mainImage} alt="vehicle" />
          </div>

          <div className="vehicleThumbnailRow">
            <img
              src={vehicleImages.front}
              onClick={() => setMainImage(vehicleImages.front)}
              alt="front"
            />

            <img
              src={vehicleImages.side}
              onClick={() => setMainImage(vehicleImages.side)}
              alt="side"
            />

            <img
              src={vehicleImages.interior}
              onClick={() => setMainImage(vehicleImages.interior)}
              alt="interior"
            />

            <img
              src={vehicleImages.back}
              onClick={() => setMainImage(vehicleImages.back)}
              alt="back"
            />
          </div>
        </div>

        {/* DETAILS SECTION */}

        <div className="vehicleInfoSection">
          {/* BASIC INFO */}

          <div className="vehicleCard">
            <h3>Basic Information</h3>

            <div className="vehicleInfoRow">
              <label>Type</label>
              {isEditing ? (
                <input
                  name="type"
                  value={vehicle.vehicleType}
                  onChange={handleChange}
                />
              ) : (
                <p>{vehicle.vehicleType}</p>
              )}
            </div>

            {/* <div className="vehicleInfoRow">
              <label>Make</label>
              {isEditing ? (
                <input
                  name="make"
                  value={vehicle.make}
                  onChange={handleChange}
                />
              ) : (
                <p>{vehicle.make}</p>
              )}
            </div> */}

            <div className="vehicleInfoRow">
              <label>Model</label>
              {isEditing ? (
                <input
                  name="model"
                  value={vehicle.vehicleModel}
                  onChange={handleChange}
                />
              ) : (
                <p>{vehicle.vehicleModel}</p>
              )}
            </div>

            {/* <div className="vehicleInfoRow">
              <label>Year</label>
              {isEditing ? (
                <input
                  name="year"
                  value={vehicle.year}
                  onChange={handleChange}
                />
              ) : (
                <p>{vehicle.year}</p>
              )}
            </div> */}

            <div className="vehicleInfoRow">
              <label>License</label>
              {isEditing ? (
                <input
                  name="license"
                  value={vehicle.vehicleNo}
                  onChange={handleChange}
                />
              ) : (
                <p>{vehicle.vehicleNo}</p>
              )}
            </div>
          </div>

          {/* SPECIFICATIONS */}

          <div className="vehicleCard">
            <h3>Vehicle Specifications</h3>

            <div className="vehicleInfoRow">
              <label>Passenger Capacity:</label>
              {isEditing ? (
                <input
                  name="passengers"
                  value={vehicle.seatCapacity}
                  onChange={handleChange}
                />
              ) : (
                <p>{vehicle.seatCapacity}</p>
              )}
            </div>

            <div className="vehicleInfoRow">
              <label>Luggage Capacity:</label>
              {isEditing ? (
                <input
                  name="luggage"
                  value={vehicle.luggage}
                  onChange={handleChange}
                />
              ) : (
                <p>{vehicle.luggage || "Nil"}</p>
              )}
            </div>

            <div className="vehicleInfoRow">
              <label>Fuel:</label>
              {isEditing ? (
                <input
                  name="fuel"
                  value={vehicle.fuelType}
                  onChange={handleChange}
                />
              ) : (
                <p>{vehicle.fuelType}</p>
              )}
            </div>

            {/* <div className="vehicleInfoRow">
              <label>Transmission:</label>
              {isEditing ? (
                <input
                  name="transmission"
                  value={vehicle.transmission}
                  onChange={handleChange}
                />
              ) : (
                <p>{vehicle.transmission}</p>
              )}
            </div> */}

            <div className="vehicleInfoRow">
              <label>AC:</label>
              {isEditing ? (
                <input name="ac" value={vehicle.AC} onChange={handleChange} />
              ) : (
                <p>{vehicle.AC ? "Yes" : "No"}</p>
              )}
            </div>
          </div>

          {/* STATUS */}

          <div className="vehicleCard">
            <h3>Status & Documentation</h3>

            <div className="vehicleInfoRow">
              <label>Status:</label>
              {isEditing ? (
                <input
                  name="status"
                  value={vehicle.status}
                  onChange={handleChange}
                />
              ) : (
                <p>{vehicle.status}</p>
              )}
            </div>

            <div className="vehicleInfoRow">
              <label>Insurance:</label>
              {isEditing ? (
                <input
                  name="insurance"
                  value={vehicle.policyNo}
                  onChange={handleChange}
                />
              ) : (
                <p>{vehicle.policyNo}</p>
              )}
            </div>
          </div>

          <div className="vehicleButtonRow">
            {isEditing ? (
              <button
                className="vehicleSaveBtn"
                onClick={() => setIsEditing(false)}
              >
                Save
              </button>
            ) : (
              <button
                className="vehicleEditBtn"
                onClick={() => setIsEditing(true)}
              >
                Edit Vehicle
              </button>
            )}
            <button
              onClick={() => navigate("/admin/vehicles")}
              className="vehicleBackBtn"
            >
              back to vehicle list
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;
