import React, { useState, useEffect } from "react";
import "../../Styles/Trips.css";
import { LiaCarSideSolid } from "react-icons/lia";
import { GoDotFill } from "react-icons/go";
import { FaRegCircleDot } from "react-icons/fa6";
import "leaflet/dist/leaflet.css";
import TripMap from "./TripMap";
import { Data, recentTripActivityData, Customers } from "../../Data/Data";
import { FiPhone } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import {
  getDriver,
  getVehicle,
  TripsData,
} from "../../services/customerService";
import { getAvatarColor } from "../../services/driverService";

export default function Trips() {
  const status = ["All", "Active", "Pending", "Completed"];
  const [Active, setActive] = useState("All");
  const [coords, setCoords] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const DateStyle = {
    color: "gray",
    fontSize: "0.7rem",
  };

  useEffect(() => {
    const fetchData = async () => {
      const [driverRes, vehicleRes, tripRes] = await Promise.all([
        getDriver(),
        getVehicle(),
        TripsData(),
      ]);
      setDrivers(driverRes || []);
      setVehicles(vehicleRes || []);
      setTrips(tripRes || []);
      setFilterData(tripRes || []);
      getCoordinates(tripRes[0]);
    };
    fetchData();
  }, []);

  const getDriverDetails = (id) => {
    return drivers.find((driver) => driver._id === id);
  };

  const getVehicleDetails = (id) => {
    return vehicles.find((vehicle) => vehicle._id === id);
  };

  function handleFilterChange(status) {
    if (status.toLowerCase() === "all") setFilterData(trips);
    else setFilterData(trips.filter((value) => value.status === status));
  }

  const getCoordinates = async (value) => {
    try {
      const sourceUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${value?.pickupCity}`;
      const destinationUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${value?.destinationCity}`;
      const sourceRes = await fetch(sourceUrl, {
        headers: {
          Accept: "application/json",
        },
      });

      const destinationRes = await fetch(destinationUrl, {
        headers: {
          Accept: "application/json",
        },
      });

      const sourceData = await sourceRes.json();
      const destinationData = await destinationRes.json();
      if (sourceData.length > 0 && destinationData.length > 0) {
        setCoords({
          source: {
            lat: parseFloat(sourceData[0].lat),
            lon: parseFloat(sourceData[0].lon),
          },
          destination: {
            lat: parseFloat(destinationData[0].lat),
            lon: parseFloat(destinationData[0].lon),
          },
        });
      } else {
        console.log("Location not found");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  return (
    <div className="trips-container-div">
      <div className="trips-title-div">
        <div className="trips-title">
          <h1>Trip Management</h1>
          <p>Monitor active trips and assign drivers. Live tracking enabled.</p>
        </div>
        <div className="trips-button-div">
          <div className="trips-button">
            <button>+ New Trip</button>
          </div>
          <div className="trips-group-button-div">
            {status.map((value, index) => (
              <div key={index}>
                <button
                  className={Active === value ? "trip-active-button" : ""}
                  onClick={() => {
                    setActive(value);
                    handleFilterChange(value);
                  }}
                >
                  {value}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="trips-body-container-div">
        <div className="trip-card-div-scroll">
          <div className="tripcard-container">
            {filterData.map((value) => {
              let driver = getDriverDetails(value.driverId);
              let vehicle = getVehicleDetails(value.vehicleId);
              return (
                <div
                  key={value._id}
                  className="trips-card-container-div"
                  onClick={() => {
                    getCoordinates(value);
                  }}
                >
                  <div className="trips-card-title-div">
                    <div className="trips-card-icons">
                      <div className="trips-icons">
                        <LiaCarSideSolid className="trips-car-icons" />
                      </div>
                      <div className="trips-card-title">
                        <h3>{vehicle?.vehicleNo || "Not Assigned"}</h3>
                        <p style={DateStyle}>
                          <span>
                            {value.dateAndTime.split("T")[0]}{" "}
                            <GoDotFill className="trips-time-dot" />{" "}
                            {value.dateAndTime.split("T")[1].split(".")[0]}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`status-pill ${value.status.toLowerCase()}`}
                      >
                        {value.status}
                      </span>
                    </div>
                  </div>
                  <div className="trips-content-container">
                    <div className="trips-pickup-dropoff-div">
                      <div className="trips-pickup">
                        <div className="trips-pickup-dot">
                          <FaRegCircleDot style={{ color: "#087f5b" }} />
                        </div>
                        <div className="trip-pickup-content">
                          <p className="p-trip-pickup-drop">PICKUP</p>
                          <p style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                            {value.pickupCity}
                          </p>
                        </div>
                      </div>

                      <div className="trips-dropoff">
                        <div className="trips-dropoff-dot">
                          <FaRegCircleDot style={{ color: "#fa5252" }} />
                        </div>
                        <div className="trip-dropoff-content">
                          <p className="p-trip-pickup-drop">DROPOFF</p>
                          <p style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                            {value.destinationCity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="trips-card-driver-info">
                    <div className="trips-card-driver-icons-name">
                      <div className="trips-card-driver-icon">
                        {driver?.profile ? (
                          <img src={driver?.profile} alt="" />
                        ) : (
                          <div
                            style={{
                              backgroundColor: getAvatarColor(driver?.name),
                              height: "50px",
                              width: "50px",
                            }}
                            className="driver-image-no-div"
                          >
                            <span style={{ fontSize: "1rem" }}>
                              {driver?.name
                                ? driver.name
                                    .split(" ")
                                    .map((w) => w[0])
                                    .join("")
                                    .slice(0, 2)
                                : "NA"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="trips-card-driver-name">
                        <p style={{ fontSize: "0.9rem", color: "gray" }}>
                          Driver
                        </p>
                        <p className="p-trips-driver-name">
                          {driver?.name || "Not Assigned"}
                        </p>
                      </div>
                    </div>
                    <div className="trips-card-driver-info-icons">
                      <div className="trips-card-driver-phone-icon">
                        <FiPhone />
                      </div>
                      <div className="trips-card-driver-message-icon">
                        <FiMessageSquare />
                      </div>
                      <div className="trips-card-driver-threedot-icon">
                        <BsThreeDots />
                      </div>
                    </div>
                  </div>
                  <div className="trips-card-customer-details">
                    <div className="trips-card-customer-name">
                      <p style={{ fontSize: "0.9rem", color: "gray" }}>
                        Customer: {value?.name}
                      </p>
                    </div>
                    <div className="trips-card-customer-cost"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="trips-map-container">
          <TripMap Coords={coords} />
        </div>
      </div>
    </div>
  );
}
