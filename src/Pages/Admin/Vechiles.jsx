// import React, { useState } from "react";
// import "../../Styles/Vehicles.css";
// import check from "../../assets/check.png";
// import deliverytruck from "../../assets/deliverytruck.png";
// import speedometer from "../../assets/speedometer.png";
// import tool from "../../assets/tool.png";
// import { FaCarSide } from "react-icons/fa6";
// import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
// function Vehicles() {
// const [showForm, setShowForm] = useState(false);
// const [selectedFilter, setSelectedFilter] = useState("All");
// const [search, setSearch] = useState("");
// const [formData, setFormData] = useState({
//   name: "",
//   number: "",
//   type: "Sedan",
//   location: ""
// });
// const [errors, setErrors] = useState({});

// const stats = [
//   { title: "Available", count: availableCount, img: check },
//   { title: "InUse", count: inUseCount, img: deliverytruck },
//   { title: "Maintenance", count: maintenanceCount, img: tool },
//   { title: "TotalFleet", count: totalFleet, img: speedometer }
// ];
// const filters = [
//   "All",
//   "Sedan",
//   "SUV",
//   "Van",
//   "Available",
//   "InUse",
//   "Maintenance"
// ];
// const [vehicleList, setVehicleList] = useState([
//   {
//     id:1,
//     name: "Toyota Camry",
//     number: "ABC-1234",
//     type: "Sedan",
//     status: "Available",
//     km: "45,325 Km",
//     fuel: "75%",
//     lastService: "2024-02-15",
//     location: "Times Square"
//   },
//   {
//     id:2,
//     name: "Honda CR-V",
//     number: "XYZ-9876",
//     type: "SUV",
//     status: "Available",
//     km: "39,500 Km",
//     fuel: "80%",
//     lastService: "2024-01-20",
//     location: "Central Park"
//   }
// ]);
// const handleChange = (e) => {
//   setFormData({
//     ...formData,
//     [e.target.name]: e.target.value
//   });
// };
// const handleAddVehicle = () => {
// let newErrors = {};
// if (!formData.name.trim()) {
//   newErrors.name = "Vehicle name is required";
// }

// if (!formData.number.trim()) {
//   newErrors.number = "Vehicle number is required";
// }

// if (!formData.location.trim()) {
//   newErrors.location = "Location is required";
// }

// const alreadyExists = vehicleList.some(
//   vehicle => vehicle.number === formData.number
// );

// if (alreadyExists) {
//   newErrors.number = "Vehicle number already exists";
// }

// if (Object.keys(newErrors).length > 0) {
//   setErrors(newErrors);
//   return;
// }

// const newVehicle = {
//   id: Date.now(),
//   ...formData,
//   status: "Available",
//   km: "0 Km",
//   fuel: "100%",
//   lastService: "2026-01-01"
// };

// setVehicleList([...vehicleList, newVehicle]);

// setShowForm(false);

// setFormData({
//   name: "",
//   number: "",
//   type: "Sedan",
//   location: ""
// });

// setErrors({});
// };

// const toggleStatus = (id) => {

// setVehicleList(prev =>
//   prev.map(vehicle =>
//     vehicle.id === id
//       ? {
//           ...vehicle,
//           status:
//             vehicle.status === "Available"
//               ? "Maintenance"
//               : vehicle.status === "Maintenance"
//               ? "InUse"
//               : "Available"
//         }
//       : vehicle
//   )
// );

// };

// const filteredVehicles = vehicleList
// .filter(vehicle => {

// if(search === "") return true;

// return (
// vehicle.name.toLowerCase().includes(search.toLowerCase()) ||
// vehicle.number.toLowerCase().includes(search.toLowerCase()) ||
// vehicle.location.toLowerCase().includes(search.toLowerCase())
// );

// })
// .filter(vehicle => {

// if (selectedFilter === "All") return true;

// if (
// selectedFilter === "Available" ||
// selectedFilter === "Maintenance" ||
// selectedFilter === "InUse"
// ) {
// return vehicle.status === selectedFilter;
// }

// return vehicle.type === selectedFilter;

// });

// return (
// <div className="vehicles-page">

// <div className="vehicles-header">
// <div>
// <h1>Vehicle Management</h1>
// <p>Manage your vehicles with live location tracking.</p>
// </div>

// <div className="header-actions">
// <input
// placeholder="Search fleet..."
// value={search}
// onChange={(e)=>setSearch(e.target.value)}
// />

// <button className="add-btn" onClick={() => setShowForm(true)}>
// + Add Vehicle
// </button>
// </div>
// </div>

// <div className="stats-container">
// {stats.map((item, index) => (
// <div className="stat-card" key={index}>
// <div>
// <p>{item.title}</p>
// <h1 className={`count-${item.title}`}>{item.count}</h1>
// </div>

// <div>
// <img src={item.img} className={`icon-${item.title}`} />
// </div>

// </div>
// ))}
// </div>

// <div className="filter-container">
// {filters.map((filter, index) => (
// <button
// key={index}
// onClick={() => setSelectedFilter(filter)}
// className={selectedFilter === filter ? "active-filter" : ""}
// >
// {filter}
// </button>
// ))}
// </div>

// <div className="vehicle-list">
// {filteredVehicles.map((vehicle) => (

// <div className="vehicle-card" key={vehicle.id}>

// <div className="vehicle-status">
// <span className={vehicle.status}>{vehicle.status}</span>
// </div>

// <div className="vehicle-info">
// <FaCarSide />
// <h3>{vehicle.name}</h3>
// <p>{vehicle.number}</p>
// <span className="vehicle-type">{vehicle.type}</span>
// </div>

// <div className="vehicle-data">
// <p>KM: {vehicle.km}</p>
// <p>Fuel: {vehicle.fuel}</p>
// <p>Service: {vehicle.lastService}</p>
// <p>{vehicle.location}</p>
// </div>

// <div className="vehicle-action">
// <button className="view-btn">View Details</button>

// <HiOutlineWrenchScrewdriver
// className="screwicon"
// onClick={() => toggleStatus(vehicle.id)}
// />

// </div>

// </div>
// ))}
// </div>

// {showForm && (

// <div className="vehicle-modal">

// <div className="vehicle-form">

// <h2>Add Vehicle</h2>

// <input
// name="name"
// placeholder="Vehicle Name"
// value={formData.name}
// onChange={handleChange}
// className={errors.name ? "input-error" : ""}
// />
// {errors.name && <p className="error-text">{errors.name}</p>}

// <input
// name="number"
// placeholder="Vehicle Number"
// value={formData.number}
// onChange={handleChange}
// className={errors.number ? "input-error" : ""}
// />
// {errors.number && <p className="error-text">{errors.number}</p>}

// <select
// name="type"
// value={formData.type}
// onChange={handleChange}
// >
// <option>Sedan</option>
// <option>SUV</option>
// <option>Van</option>
// </select>

// <input
// name="location"
// placeholder="Location"
// value={formData.location}
// onChange={handleChange}
// className={errors.location ? "input-error" : ""}
// />
// {errors.location && <p className="error-text">{errors.location}</p>}

// <div className="form-actions">

// <button className="add-vehicle-btn" onClick={handleAddVehicle}>
// Add Vehicle
// </button>

// <button
// className="cancel-btn"
// onClick={() => setShowForm(false)}
// >
// Cancel
// </button>

// </div>

// </div>

// </div>
// )}
// </div>
// );
// }
// export default Vehicles;
import React, { useState } from "react";
import "../../Styles/Vehicles.css";
import check from "../../assets/check.png";
import deliverytruck from "../../assets/deliverytruck.png";
import speedometer from "../../assets/speedometer.png";
import tool from "../../assets/tool.png";
import { FaCarSide } from "react-icons/fa6";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";

function Vehicles() {

const [showForm, setShowForm] = useState(false);
const [selectedFilter, setSelectedFilter] = useState("All");
const [search, setSearch] = useState("");

const [formData, setFormData] = useState({
  name: "",
  number: "",
  type: "Sedan",
  location: ""
});

const [errors, setErrors] = useState({});

const filters = [
  "All",
  "Sedan",
  "SUV",
  "Van",
  "Available",
  "InUse",
  "Maintenance"
];

const [vehicleList, setVehicleList] = useState([
  {
    id:1,
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
    id:2,
    name: "Honda CR-V",
    number: "XYZ-9876",
    type: "SUV",
    status: "Available",
    km: "39,500 Km",
    fuel: "80%",
    lastService: "2024-01-20",
    location: "Central Park"
  },
  {
    id:3,
    name: "MERCEDS ",
    number: "XYZ-9876",
    type: "Van",
    status: "Available",
    km: "39,500 Km",
    fuel: "80%",
    lastService: "2024-01-20",
    location: "Central Park"
  }
]);

// 🔥 Dynamic stats calculation
const availableCount = vehicleList.filter(v => v.status === "Available").length;
const inUseCount = vehicleList.filter(v => v.status === "InUse").length;
const maintenanceCount = vehicleList.filter(v => v.status === "Maintenance").length;
const totalFleet = vehicleList.length;

const stats = [
  { title: "Available", count: availableCount, img: check },
  { title: "InUse", count: inUseCount, img: deliverytruck },
  { title: "Maintenance", count: maintenanceCount, img: tool },
  { title: "TotalFleet", count: totalFleet, img: speedometer }
];

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleAddVehicle = () => {

let newErrors = {};

if (!formData.name.trim()) {
  newErrors.name = "Vehicle name is required";
}

if (!formData.number.trim()) {
  newErrors.number = "Vehicle number is required";
}

if (!formData.location.trim()) {
  newErrors.location = "Location is required";
}

const alreadyExists = vehicleList.some(
  vehicle => vehicle.number === formData.number
);

if (alreadyExists) {
  newErrors.number = "Vehicle number already exists";
}

if (Object.keys(newErrors).length > 0) {
  setErrors(newErrors);
  return;
}

const newVehicle = {
  id: Date.now(),
  ...formData,
  status: "Available",
  km: "0 Km",
  fuel: "100%",
  lastService: "2026-01-01"
};

setVehicleList([...vehicleList, newVehicle]);

setShowForm(false);

setFormData({
  name: "",
  number: "",
  type: "Sedan",
  location: ""
});

setErrors({});
};

const toggleStatus = (id) => {

setVehicleList(prev =>
  prev.map(vehicle =>
    vehicle.id === id
      ? {
          ...vehicle,
          status:
            vehicle.status === "Available"
              ? "Maintenance"
              : vehicle.status === "Maintenance"
              ? "InUse"
              : "Available"
        }
      : vehicle
  )
);

};

const filteredVehicles = vehicleList
.filter(vehicle => {

if(search === "") return true;

return (
vehicle.name.toLowerCase().includes(search.toLowerCase()) ||
vehicle.number.toLowerCase().includes(search.toLowerCase()) ||
vehicle.location.toLowerCase().includes(search.toLowerCase())
);

})
.filter(vehicle => {

if (selectedFilter === "All") return true;

if (
selectedFilter === "Available" ||
selectedFilter === "Maintenance" ||
selectedFilter === "InUse"
) {
return vehicle.status === selectedFilter;
}

return vehicle.type === selectedFilter;

});

return (
<div className="vehicles-page">

<div className="vehicles-header">

<div>
<h1>Vehicle Management</h1>
<p>Manage your vehicles with live location tracking.</p>
</div>

<div className="header-actions">

<input
placeholder="Search fleet..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<button className="add-btn" onClick={() => setShowForm(true)}>
+ Add Vehicle
</button>

</div>

</div>

<div className="stats-container">

{stats.map((item, index) => (

<div className="stat-card" key={index}>

<div>
<p>{item.title}</p>
<h1 className={`count-${item.title}`}>{item.count}</h1>
</div>

<div>
<img src={item.img} className={`icon-${item.title}`} />
</div>

</div>

))}

</div>

<div className="filter-container">

{filters.map((filter, index) => (

<button
key={index}
onClick={() => setSelectedFilter(filter)}
className={selectedFilter === filter ? "active-filter" : ""}
>

{filter}

</button>

))}

</div>

<div className="vehicle-list">

{filteredVehicles.map((vehicle) => (

<div className="vehicle-card" key={vehicle.id}>

<div className="vehicle-status">
<span className={vehicle.status}>{vehicle.status}</span>
</div>

<div className="vehicle-info">
<FaCarSide />
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

<button className="view-btn">View Details</button>

<HiOutlineWrenchScrewdriver
className="screwicon"
onClick={() => toggleStatus(vehicle.id)}
/>

</div>

</div>

))}

</div>

{showForm && (

<div className="vehicle-modal">

<div className="vehicle-form">

<h2>Add Vehicle</h2>

<input
name="name"
placeholder="Vehicle Name"
value={formData.name}
onChange={handleChange}
className={errors.name ? "input-error" : ""}
/>

{errors.name && <p className="error-text">{errors.name}</p>}

<input
name="number"
placeholder="Vehicle Number"
value={formData.number}
onChange={handleChange}
className={errors.number ? "input-error" : ""}
/>

{errors.number && <p className="error-text">{errors.number}</p>}

<select
name="type"
value={formData.type}
onChange={handleChange}
>

<option>Sedan</option>
<option>SUV</option>
<option>Van</option>

</select>

<input
name="location"
placeholder="Location"
value={formData.location}
onChange={handleChange}
className={errors.location ? "input-error" : ""}
/>

{errors.location && <p className="error-text">{errors.location}</p>}

<div className="form-actions">

<button className="add-vehicle-btn" onClick={handleAddVehicle}>
Add Vehicle
</button>

<button
className="cancel-btn"
onClick={() => setShowForm(false)}
>
Cancel
</button>

</div>

</div>

</div>

)}

</div>
);
}

export default Vehicles;