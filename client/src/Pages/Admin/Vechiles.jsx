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
  updateVehicleField,
} from "../../services/vehicleService";
import { MdDelete } from "react-icons/md";
import AlertDialogSlide from "../../Components/AlertDialogSlide";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";
import { useLocation } from "react-router-dom";
import { TbCarSuvFilled } from "react-icons/tb";
import { FaVanShuttle } from "react-icons/fa6";
import { SiTicktick } from "react-icons/si";
import { FaCar } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { MdOutlineSpeed } from "react-icons/md";

function Vehicles() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const filters = [
    "All",
    "Sedan",
    "SUV",
    "Van",
    "Available",
    "InUse",
    "Maintenance",
  ];

  const carIcon = {
    Sedan: <FaCarSide />,
    SUV: <TbCarSuvFilled />,
    Van: <FaVanShuttle />,
  };

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
    {
      title: "Available",
      count: availableCount,
      img: <SiTicktick />,
      status: "<FaCarSide />",
      color: "#22c55e",
      background: "#f0fdf4",
    },
    {
      title: "InUse",
      count: inUseCount,
      img: <FaCar />,
      color: "#6b69f1",
      background: "#eef2ff",
    },
    {
      title: "Maintenance",
      count: maintenanceCount,
      img: <FaTools />,
      color: "#f59e0b",
      background: "#fffbeb",
    },
    {
      title: "TotalFleet",
      count: totalFleet,
      img: <MdOutlineSpeed />,
      color: "#ef4444",
      background: "#fef2f2",
    },
  ];

  useEffect(() => {
    let fetchData = async () => {
      const data = await getVehicle();
      setVehicleList(data);
      console.log(vehicleList);
    };
    fetchData();
  }, []);

  const toggleStatus = async (value) => {
    if (!value || !value._id) return null;
    const updatedvalue = vehicleList.find((v) => v._id === value._id);
    const nextStatus =
      updatedvalue.status === "Available"
        ? "Maintenance"
        : updatedvalue.status === "Maintenance"
          ? "InUse"
          : "Available";
    setVehicleList((prev) =>
      prev.map((vehicle) =>
        vehicle._id === value._id
          ? {
              ...vehicle,
              status: nextStatus,
            }
          : vehicle,
      ),
    );
    await updateVehicleField(updatedvalue._id, {
      status: nextStatus,
    });
  };

  const filteredVehicles = vehicleList
    .filter((vehicle) => {
      if (search === "") return true;

      return (
        vehicle.vehicleModel.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.vehicleNo.toLowerCase().includes(search.toLowerCase())
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

      return vehicle.vehicleType === selectedFilter;
    });

  async function handleDeleteVehicle(value) {
    try {
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
            placeholder="Search..."
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
          <div
            className="stat-card"
            key={index}
            style={{ borderLeftColor: item.color }}
          >
            <div
              className="v-icon"
              style={{ color: item.color, background: item.background }}
            >
              {item.img}
            </div>
            <div>
              <p>{item.title}</p>
              <h1>{item.count}</h1>
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
      {filteredVehicles.length > 0 ? (
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
                <div className="vehicle-image">
                  {vehicle?.frontView ? (
                    <img src={vehicle.frontView} alt="vehicle" />
                  ) : (
                    <FaCarSide className="vehicle-icon" />
                  )}
                </div>
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
                  onClick={() => toggleStatus(vehicle)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="v-vehicle-empty">
          <p>No Vehicles Found</p>
        </div>
      )}

      {showForm && (
        <VechileModal
          onSave={async (vehicle) => {
            try {
              const data = await addVehicle(vehicle);
              setVehicleList((prev) => [...prev, data]);
              setSnackbar((p) => ({
                ...p,
                open: true,
                message: `Vehicle "${vehicle?.vehicleModel || "Unknown"}" Added successfully!`,
                severity: "success",
              }));
              setShowForm(false);
            } catch (error) {
              console.error("Failed to add vehicle:", error);
              setVehicleList((prev) => prev.filter((v) => v !== vehicle));
              setSnackbar((p) => ({
                ...p,
                open: true,
                message: `Error ${error.message}`,
                severity: "error",
              }));
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
