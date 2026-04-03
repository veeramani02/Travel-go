import React, { useEffect, useState } from "react";
import "../../Styles/VehicleDetails.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { updateVehicle } from "../../services/vehicleService";

function VehicleDetails() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const [vehicle, setVehicle] = useState(location.state);
  const [oldVehicle, setOldVehicle] = useState(location.state);

  const vehicleImages = {
    front: vehicle.frontView,
    side: vehicle.sideView,
    interior: vehicle.interior,
    back: vehicle.backView,
  };

  useEffect(() => console.log(vehicle));

  const [mainImage, setMainImage] = useState(vehicleImages.front);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setVehicle((p) => ({
      ...p,
      [name]: name === "AC" ? value === "Yes" : value,
    }));
  };

  async function handleUpdatedData() {
    try {
      const isChange = oldVehicle !== vehicle;
      if (isChange) await updateVehicle(vehicle._id, vehicle);
      if (!isChange) {
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <div className="vehicleDetailsPage">
      <h2 className="vehicleDetailsTitle">
        Vehicle Details: {vehicle.vehicleModel} [{vehicle.vehicleNo}]
        <span className="vehicleStatusBadge">{vehicle.status}</span>
      </h2>

      <div className="vehicleDetailsContainer">
        {/* IMAGE SECTION */}

        <div className="vehicleImageSection">
          {mainImage ? (
            <div className="vehicleMainImage">
              <img src={mainImage} alt="vehicle" />
            </div>
          ) : (
            <div className="no_image_preview">
              <p>No Image</p>
            </div>
          )}

          <div className="vehicleThumbnailRow">
            {vehicleImages.front ? (
              <img
                src={vehicleImages.front}
                onClick={() => setMainImage(vehicleImages.front)}
                alt="front"
              />
            ) : (
              <div className="no_image_vehicle">
                <p>No Front Image</p>
              </div>
            )}

            {vehicleImages.side ? (
              <img
                src={vehicleImages.side}
                onClick={() => setMainImage(vehicleImages.side)}
                alt="side"
              />
            ) : (
              <div className="no_image_vehicle">
                <p>No Side Image</p>
              </div>
            )}
            {vehicle.interior ? (
              <img
                src={vehicleImages.interior}
                onClick={() => setMainImage(vehicleImages.interior)}
                alt="interior"
              />
            ) : (
              <div className="no_image_vehicle">
                <p>No Interior Image</p>
              </div>
            )}
            {vehicleImages.back ? (
              <img
                src={vehicleImages.back}
                onClick={() => setMainImage(vehicleImages.back)}
                alt="back"
              />
            ) : (
              <div className="no_image_vehicle">
                <p>No Back Image</p>
              </div>
            )}
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
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={vehicle.vehicleType}
                  onChange={handleChange}
                >
                  <option>--select--</option>
                  <option>Sedan</option>
                  <option>SUV</option>
                  <option>Van</option>
                  <option>Minibus</option>
                  <option>Luxury Coach</option>
                </select>
              ) : (
                <p>{vehicle.vehicleType}</p>
              )}
            </div>

            <div className="vehicleInfoRow">
              <label>Vehicle Model</label>
              {isEditing ? (
                <input
                  name="vehicleModel"
                  value={vehicle.vehicleModel}
                  onChange={handleChange}
                />
              ) : (
                <p>{vehicle.vehicleModel}</p>
              )}
            </div>

            <div className="vehicleInfoRow">
              <label>Vehicle No</label>
              {isEditing ? (
                <input
                  name="vehicleNo"
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
                  name="seatCapacity"
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
                  name="luggageCapacity"
                  value={vehicle.luggageCapacity}
                  onChange={handleChange}
                />
              ) : (
                <p>{vehicle.luggageCapacity || "Nil"}</p>
              )}
            </div>

            <div className="vehicleInfoRow">
              <label>Fuel Type:</label>
              {isEditing ? (
                <select
                  name="fuelType"
                  value={vehicle.fuelType}
                  onChange={handleChange}
                >
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Hybrid</option>
                  <option>Electric</option>
                </select>
              ) : (
                <p>{vehicle.fuelType}</p>
              )}
            </div>

            <div className="vehicleInfoRow">
              <label>AC:</label>
              {isEditing ? (
                <select
                  name="AC"
                  value={vehicle.AC ? "Yes" : "No"}
                  onChange={handleChange}
                >
                  <option value="">--select--</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
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
                <select
                  name="status"
                  value={vehicle.status}
                  onChange={handleChange}
                >
                  <option value="Availabe">Available</option>
                  <option value="In-Use">In-Use</option>
                  <option value="In Maintenance">In Maintenance</option>
                  <option value="Out of Service">Out of Service</option>
                </select>
              ) : (
                <p>{vehicle.status}</p>
              )}
            </div>

            <div className="vehicleInfoRow">
              <label>Insurance:</label>
              {isEditing ? (
                <input
                  name="policyNo"
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
                onClick={async () => {
                  await handleUpdatedData();
                  setIsEditing(false);
                }}
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
