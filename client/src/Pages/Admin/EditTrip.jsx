import React, { useState, useEffect } from "react";
import "../../Styles/EditTrip.css";
import {
  getDriver,
  getVehicle,
  status,
  updateTrips,
} from "../../services/customerService.js";
import { City } from "country-state-city";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars.jsx";

export default function EditTrip({ isOpen, onClose, trip, onsave, isClose }) {
  const [formData, setFormData] = useState(null);
  const [pickupCities, setPickupCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [errors, setErrors] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const oldData = formData;

  useEffect(() => {
    if (!trip) return;
    const pickup = City.getCitiesOfState("IN", trip.Data.pickupState);
    const destination = City.getCitiesOfState("IN", trip.Data.destinationState);
    setPickupCities(pickup);
    setDestinationCities(destination);
    setFormData(trip.Data);
  }, [trip]);

  useEffect(() => {
    const fetchData = async () => {
      const [driverRes, vehicleRes] = await Promise.all([
        getDriver(),
        getVehicle(),
      ]);
      setDrivers(driverRes || []);
      setVehicles(vehicleRes || []);
    };
    fetchData();
  }, []);
  const activeDrivers = drivers.filter(
    (value) => value?.status?.toLowerCase().trim() === "active",
  );
  const activeVehicles = vehicles.filter(
    (value) => value?.status?.toLowerCase().trim() === "available",
  );

  async function handlesubmit() {
    try {
      let { driverId, vehicleId } = formData;
      let error = {};
      if (!driverId) error.driver = "Required Driver";
      if (!vehicleId) error.vehicle = "Required Vehicle";
      setErrors(error);
      if (Object.keys(error).length !== 0) {
        setSnackbar({
          open: true,
          message: error.driver || error.vehicle,
          severity: "error",
        });
        return;
      }
      onsave(formData);
      await updateTrips(formData);
      onClose();
    } catch (e) {
      console.error(e.message);
    }
  }

  if (!isOpen || !formData) return null;
  return (
    <div className={`modal-overlay ${isClose ? "close" : "open"} `}>
      <div className="modal">
        <h2 className="h2">
          Edit Trip: #{trip.Data._id.slice(4, 8).toUpperCase()}
        </h2>

        <div className="body">
          <h4 className="body-title">Passenger Details</h4>
          <form action="">
            <div className="input-div">
              <div className="input label">
                <div>
                  <label htmlFor="">Name</label>
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="input label">
                <div>
                  <label htmlFor="">Phone</label>
                </div>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div className="input label">
                <div>
                  <label htmlFor="">Email</label>
                </div>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="select label">
              <div className="edittrip-select-div">
                <div className="edittrip-type-driver">
                  <div>
                    <label htmlFor="">Vehicle Type</label>
                  </div>
                  <div>
                    <input
                      type="text"
                      defaultValue={trip.Data.vehicleType}
                      readOnly
                    />
                  </div>
                </div>
                <div className="edittrip-type-driver">
                  <div>
                    <label htmlFor="assigndriver">Assign Driver</label>
                  </div>
                  <div>
                    <select
                      id="assigndriver"
                      name="assigndriver"
                      value={formData.driverId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          driverId: e.target.value,
                        })
                      }
                    >
                      <option value="">--select--</option>
                      {activeDrivers.map((v) => (
                        <option value={v._id} key={v._id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="edittrip-type-driver">
                  <div>
                    <label htmlFor="assignvehicle">Assign Vehicle</label>
                  </div>
                  <div>
                    <select
                      id="assignvehicle"
                      name="assignvehicle"
                      value={formData.vehicleId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicleId: e.target.value,
                        })
                      }
                    >
                      <option value="">--select--</option>
                      {activeVehicles.map((v) => (
                        <option
                          value={v._id}
                          key={v.vehicleModel}
                        >{`${v.vehicleModel} (${v.vehicleType})`}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="trip-info">
              <div className="address-div">
                <div className="pickup-input label">
                  <label htmlFor="pickupCity">PickUp</label>
                  <select
                    name="pickupCity"
                    value={formData.pickupCity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickupCity: e.target.value,
                      })
                    }
                  >
                    <option value="">--Select City--</option>
                    {pickupCities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="drop-input label">
                  <label htmlFor="destinationCity">Drop off</label>
                  <select
                    name="destinationCity"
                    value={formData.destinationCity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destinationCity: e.target.value,
                      })
                    }
                  >
                    <option value="">--Select City--</option>
                    {destinationCities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="date-div">
                <div className="label">
                  <div>
                    <label htmlFor="">Date</label>
                  </div>
                  <input
                    type="date"
                    defaultValue={trip.Data.dateAndTime.split("T")[0]}
                  />
                </div>
                <div className="label">
                  <div>
                    <label htmlFor="time">Time</label>
                  </div>
                  <input
                    type="time"
                    value={formData.dateAndTime.split("T")[1].split(".")[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateAndTime: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="label">
                  <div>
                    <label htmlFor="">Status</label>
                  </div>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="">--select--</option>
                    {status.map((v) => (
                      <option value={v.toLowerCase()} key={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="btn">
          <div>
            <button onClick={onClose}>Cancel</button>
          </div>
          <div>
            <button
              onClick={() => {
                handlesubmit();
              }}
            >
              Save Changes
            </button>
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
