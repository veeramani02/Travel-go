import React from "react";
import "../../Styles/Vehicles.css";

function Vehicles() {

  const stats = [
    { title: "Available", count: 3 },
    { title: "In Use", count: 0 },
    { title: "Maintenance", count: 1 },
    { title: "Total Fleet", count: 4 }
  ];

  const filters = [
    "All",
    "Sedan",
    "SUV",
    "Van",
    "Available",
    "In Use",
    "Maintenance"
  ];

  const vehicles = [
    {
      name: "Toyota Camry",
      number: "ABC-1234",
      type: "Sedan",
      status: "Available",
      km: "45,325 Km",
      fuel: "75%",
      lastService: "2024-02-15",
      location: "Times Square"
    },
    {
      name: "Honda CR-V",
      number: "XYZ-9876",
      type: "SUV",
      status: "Available",
      km: "39,500 Km",
      fuel: "80%",
      lastService: "2024-01-20",
      location: "Central Park"
    }
  ];

  return (
    <div className="vehicles-page">

      {/* Header */}
      <div className="vehicles-header">
        <div>
          <h1>Vehicle Management</h1>
          <p>Manage your vehicles with live location tracking.</p>
        </div>

        <div className="header-actions">
          <input placeholder="Search fleet..." />
          <button className="add-btn">+ Add Vehicle</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <p>{item.title}</p>
            <h2>{item.count}</h2>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-container">
        {filters.map((filter, index) => (
          <button key={index}>{filter}</button>
        ))}
      </div>

      {/* Vehicle List */}
      <div className="vehicle-list">
        {vehicles.map((vehicle, index) => (
          <div className="vehicle-card" key={index}>

            <div className="vehicle-status">
              <span>{vehicle.status}</span>
            </div>

            <div className="vehicle-info">
              <h3>{vehicle.name}</h3>
              <p>{vehicle.number}</p>
              <span className="vehicle-type">{vehicle.type}</span>
            </div>

            <div className="vehicle-data">
              <p>KM: {vehicle.km}</p>
              <p>Fuel: {vehicle.fuel}</p>
              <p>Service: {vehicle.lastService}</p>
              <p>{vehicle.location}</p>
            </div>

            <div className="vehicle-action">
              <button>View Details</button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Vehicles;