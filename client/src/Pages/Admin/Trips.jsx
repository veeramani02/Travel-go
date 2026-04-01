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

export default function Trips() {
  const status = ["All", "Active", "Pending", "Completed"];
  const [Active, setActive] = useState("All");
  const [coords, setCoords] = useState(null);
  const [filterData, setFilterData] = useState(recentTripActivityData);
  const DateStyle = {
    color: "gray",
    fontSize: "0.7rem",
  };

  const getDriverDetails = (id) => {
    return Data.find((driver) => driver.id === id);
  };

  const getCustomerDetails = (id) => {
    return Customers.find((customer) => customer.id === id);
  };

  function handleFilterChange(status) {
    if (status.toLowerCase() == "all") setFilterData(recentTripActivityData);
    else
      setFilterData(
        recentTripActivityData.filter((value) => value.status === status),
      );
  }

  const getCoordinates = async (value) => {
    try {
      const sourceUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${value.source}`;
      const destinationUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${value.destination}`;
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

  useEffect(() => {
    getCoordinates(filterData[0]);
  }, []);

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
            {filterData.map((value) => (
              <div
                key={value.tripId}
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
                      <h3>{value.licensePlate}</h3>
                      <p style={DateStyle}>
                        <span>
                          {value.date} <GoDotFill className="trips-time-dot" />{" "}
                          {value.time}
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
                          {value.source}
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
                          {value.destination}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="trips-card-driver-info">
                  <div className="trips-card-driver-icons-name">
                    <div className="trips-card-driver-icon">
                      <img
                        src={getDriverDetails(value.driverId)?.avatar}
                        alt=""
                      />
                    </div>
                    <div className="trips-card-driver-name">
                      <p style={{ fontSize: "0.9rem", color: "gray" }}>
                        Driver
                      </p>
                      <p className="p-trips-driver-name">
                        {getDriverDetails(value.driverId)?.name}
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
                      Customer: {getCustomerDetails(value.customerId).name}
                    </p>
                  </div>
                  <div className="trips-card-customer-cost"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="trips-map-container">
          <TripMap Coords={coords} />
        </div>
      </div>
    </div>
  );
}
