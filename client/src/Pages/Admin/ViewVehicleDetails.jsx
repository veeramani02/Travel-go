import React, { useEffect, useRef, useState } from "react";
import "../../Styles/VehicleDetails.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { updateVehicle } from "../../services/vehicleService";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";
import API_BASE_URL from "../../config/api";

function VehicleDetails() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const [vehicle, setVehicle] = useState(location.state);
  const [oldVehicle, setOldVehicle] = useState(location.state);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const frontRef = useRef();
  const sideRef = useRef();
  const interiorRef = useRef();
  const backRef = useRef();
  const [image, setImage] = useState({
    front: null,
    side: null,
    interior: null,
    back: null,
  });
  const [imageFile, setImageFile] = useState({
    front: "",
    side: "",
    interior: "",
    back: "",
    document: "",
  });

  const vehicleImages = {
    front: vehicle.frontView,
    side: vehicle.sideView,
    interior: vehicle.interior,
    back: vehicle.backView,
  };

  useEffect(() => {
    console.log(vehicle);
    if (vehicleImages.front) {
      setMainImage(vehicleImages.front);
    }
  }, []);

  useEffect(() => {
    return () => {
      Object.values(image).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

  const [mainImage, setMainImage] = useState(null);
  const handleChange = (e) => {
    let { name, value } = e.target;
    setVehicle((p) => ({
      ...p,
      [name]: name === "AC" ? value === "Yes" : value,
    }));
  };

  async function handleUpdatedData() {
    try {
      const uploadedData = await handleuploadfiles();
      const updatedVehicle = {
        ...vehicle,
        ...uploadedData,
      };
      const isChange =
        JSON.stringify(oldVehicle) !== JSON.stringify(updatedVehicle);
      if (isChange) {
        const res = await updateVehicle(vehicle._id, updatedVehicle);
        setVehicle(res);
        setOldVehicle(res);
      }
      if (!isChange)
        setSnackbar((p) => ({
          ...p,
          open: true,
          message: "No Changes Made",
          severity: "info",
        }));
    } catch (e) {
      setSnackbar({
        open: true,
        message: e.message,
        severity: "error",
      });
    }
  }

  function handlefile(e, type) {
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

    setImage((prev) => ({
      ...prev,
      [type]: previewURL,
    }));
    setImageFile((prev) => ({
      ...prev,
      [type]: file,
    }));
    setMainImage(previewURL);
  }

  async function handleuploadfiles() {
    let updatedFields = {};
    const Data = new FormData();
    if (imageFile.front) Data.append("frontViewFile", imageFile.front);
    if (imageFile.side) Data.append("sideViewFile", imageFile.side);
    if (imageFile.interior) Data.append("interiorViewFile", imageFile.interior);
    if (imageFile.back) Data.append("backViewFile", imageFile.back);
    if (
      imageFile.front ||
      imageFile.side ||
      imageFile.interior ||
      imageFile.back
    ) {
      const res = await fetch(`${API_BASE_URL}/api/vehicle/uploads`, {
        method: "POST",
        body: Data,
        credentials: "include",
      });
      if (!res.ok) throw { message: "Upload failed" };
      const result = await res.json();
      console.log("from api uploads", result);
      updatedFields = {
        frontView: result.frontViewUrl,
        sideView: result.sideViewUrl,
        interior: result.interiorViewUrl,
        backView: result.backViewUrl,
      };
    }

    return updatedFields;
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
            {image.front ? (
              <img
                src={image.front}
                onClick={() => setMainImage(image.front)}
                alt="front"
              />
            ) : vehicleImages.front ? (
              <img
                src={vehicleImages.front}
                onClick={() => setMainImage(vehicleImages.front)}
                alt="front"
              />
            ) : (
              <div
                className={`no_image_vehicle ${isEditing ? "editing" : ""}`}
                onClick={() => {
                  frontRef.current.click();
                }}
                style={{ cursor: !isEditing ? "not-allowed" : "" }}
              >
                <p>No Front Image</p>
              </div>
            )}

            {image.side ? (
              <img
                src={image.side}
                onClick={() => setMainImage(image.side)}
                alt="side"
              />
            ) : vehicleImages.side ? (
              <img
                src={vehicleImages.side}
                onClick={() => setMainImage(vehicleImages.side)}
                alt="side"
              />
            ) : (
              <div
                className={`no_image_vehicle ${isEditing ? "editing" : ""}`}
                onClick={() => {
                  
                  sideRef.current.click();
                }}
                style={{ cursor: !isEditing ? "not-allowed" : "" }}
              >
                <p>No Side Image</p>
              </div>
            )}
            {image.interior ? (
              <img
                src={image.interior}
                onClick={() => setMainImage(image.interior)}
                alt="interior"
              />
            ) : vehicleImages.interior ? (
              <img
                src={vehicleImages.interior}
                onClick={() => setMainImage(vehicleImages.interior)}
                alt="interior"
              />
            ) : (
              <div
                className={`no_image_vehicle ${isEditing ? "editing" : ""}`}
                onClick={() => {
                  interiorRef.current.click();
                }}
                style={{ cursor: !isEditing ? "not-allowed" : "" }}
              >
                <p>No Interior Image</p>
              </div>
            )}
            {image.back ? (
              <img
                src={image.back}
                onClick={() => setMainImage(image.back)}
                alt="back"
              />
            ) : vehicleImages.back ? (
              <img
                src={vehicleImages.back}
                onClick={() => setMainImage(vehicleImages.back)}
                alt="back"
              />
            ) : (
              <div
                className={`no_image_vehicle ${isEditing ? "editing" : ""}`}
                onClick={() => {
                  backRef.current.click();
                }}
                style={{ cursor: !isEditing ? "not-allowed" : "" }}
              >
                <p>No Back Image</p>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={frontRef}
            style={{ display: "none" }}
            onChange={(e) => handlefile(e, "front")}
          />
          <input
            type="file"
            ref={sideRef}
            style={{ display: "none" }}
            onChange={(e) => handlefile(e, "side")}
          />
          <input
            type="file"
            ref={interiorRef}
            style={{ display: "none" }}
            onChange={(e) => handlefile(e, "interior")}
          />
          <input
            type="file"
            ref={backRef}
            style={{ display: "none" }}
            onChange={(e) => handlefile(e, "back")}
          />
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
                  <option value="Available">Available</option>
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
            {!isEditing ? (
              <button
                onClick={() => navigate("/admin/vehicles")}
                className="vehicleBackBtn"
              >
                back to vehicle list
              </button>
            ) : (
              <button
                className="vehicleBackBtn"
                onClick={() => setIsEditing((p) => !p)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      <CustomizedSnackbars
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}

export default VehicleDetails;
