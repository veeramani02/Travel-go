import React, { useEffect, useState } from "react";
import "../../Styles/Vehicles.css";
import check from "../../assets/check.png";
import deliverytruck from "../../assets/deliverytruck.png";
import speedometer from "../../assets/speedometer.png";
import tool from "../../assets/tool.png";
import { FaCarSide } from "react-icons/fa6";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import VechileModal from "../../Components/VechileModal";
import { useNavigate } from "react-router-dom";
import {
  addVehicle,
  deleteVehicle,
  getVehicle,
} from "../../services/vehicleService";
import { MdDelete } from "react-icons/md";
import AlertDialogSlide from "../../Components/AlertDialogSlide";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";
function Vehicles() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [DeleteData, setDeletedata] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    type: "Sedan",
    location: "",
  });

  const [errors, setErrors] = useState({});

  const filters = [
    "All",
    "Sedan",
    "SUV",
    "Van",
    "Available",
    "InUse",
    "Maintenance",
  ];

  const [vehicleList, setVehicleList] = useState([]);

  const availableCount = vehicleList.filter(
    (v) => v.status === "Available",
  ).length;
  const inUseCount = vehicleList.filter((v) => v.status === "InUse").length;
  const maintenanceCount = vehicleList.filter(
    (v) => v.status === "Maintenance",
  ).length;
  const totalFleet = vehicleList.length;

  const stats = [
    { title: "Available", count: availableCount, img: check },
    { title: "InUse", count: inUseCount, img: deliverytruck },
    { title: "Maintenance", count: maintenanceCount, img: tool },
    { title: "TotalFleet", count: totalFleet, img: speedometer },
  ];

  useEffect(() => {
    let fetchData = async () => {
      const data = await getVehicle();
      setVehicleList(data);
      console.log(data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
      (vehicle) => vehicle.number === formData.number,
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
      lastService: "2026-01-01",
    };

    setVehicleList([...vehicleList, newVehicle]);

    setShowForm(false);

    setFormData({
      name: "",
      number: "",
      type: "Sedan",
      location: "",
    });

    setErrors({});
  };

  const toggleStatus = (id) => {
    setVehicleList((prev) =>
      prev.map((vehicle) =>
        vehicle.id === id
          ? {
              ...vehicle,
              status:
                vehicle.status === "Available"
                  ? "Maintenance"
                  : vehicle.status === "Maintenance"
                    ? "InUse"
                    : "Available",
            }
          : vehicle,
      ),
    );
  };

  const filteredVehicles = vehicleList
    .filter((vehicle) => {
      if (search === "") return true;

      return (
        vehicle.name.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.number.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.location.toLowerCase().includes(search.toLowerCase())
      );
    })
    .filter((vehicle) => {
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

  async function handleDeleteVehicle(value) {
    try {
      console.log(value);
      if (!value._id) return null;
      setVehicleList((pre) => pre.filter((d) => d._id !== value._id));
      await deleteVehicle(value._id);
      setSnackbar((p) => ({
        ...p,
        open: true,
        message: `Vehicle "${value?.vehicleModel || "Unknown"}" Deleted successfully!`,
      }));
    } catch (e) {
      setSnackbar((p) => ({
        ...p,
        open: true,
        message: e.message,
        severity: "error",
      }));
      console.log(e.message);
    }
  }

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
            onChange={(e) => setSearch(e.target.value)}
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
          <div className="vehicle-card" key={vehicle._id}>
            <div className="vehicle-status">
              <div>
                <span className={vehicle.status}>{vehicle.status}</span>
              </div>
              <div className="driver-DeleteButton">
                <button
                  className="btnDelete"
                  title="Delete Vehicle"
                  onClick={() => {
                    setDeletedata(vehicle);
                    setAlertDialogOpen(true);
                  }}
                >
                  <MdDelete />
                </button>
              </div>
            </div>

            <div className="vehicle-info">
              <FaCarSide />
              <h3>{vehicle.vehicleModel}</h3>
              <p>{vehicle.vehicleNo}</p>
              <span className="vehicle-type">{vehicle.vehicleType}</span>
            </div>

            <div className="vehicle-data">
              <p>
                <span>KM:</span> {vehicle.km || 15}
              </p>
              <p>
                <span>Fuel:</span> {vehicle.fuelType}
              </p>
              <p>
                <span>AC:</span> {vehicle.AC ? "Yes" : "No"}
              </p>
              <p>
                <span>Service:</span> {vehicle?.lastService || "Nil"}
              </p>
              <p>
                <span>Avaliable Seats:</span> {vehicle.seatCapacity}
              </p>
            </div>

            <div className="vehicle-action">
              <button
                className="view-btn"
                onClick={() => {
                  navigate("/vehicle-details", { state: vehicle });
                }}
              >
                View Details
              </button>

              <HiOutlineWrenchScrewdriver
                className="screwicon"
                onClick={() => toggleStatus(vehicle.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <VechileModal
          onSave={async (vehicle) => {
            console.log("from vehicle", vehicle);
            try {
              setVehicleList((prev) => [...prev, vehicle]);

              await addVehicle(vehicle);

              setShowForm(false);
            } catch (error) {
              console.error("Failed to add vehicle:", error);
              setVehicleList((prev) => prev.filter((v) => v !== vehicle));
            }
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      <AlertDialogSlide
        open={alertDialogOpen}
        onClose={() => setAlertDialogOpen(false)}
        onConfirm={() => {
          setAlertDialogOpen(false);
          handleDeleteVehicle(DeleteData);
        }}
      />
      <CustomizedSnackbars
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </div>
  );
}

export default Vehicles;
