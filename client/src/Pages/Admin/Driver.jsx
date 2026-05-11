import React, { use, useEffect, useState } from "react";
import "../../Styles/Driver.css";
import { FaMagnifyingGlass } from "react-icons/fa6";
import {
  deleteDriver,
  getDriver,
  TripsData,
  getAvatarColor,
  updateDriver,
  deleteUserDriver,
} from "../../services/driverService.js";
import AddDriver from "../../Pages/Admin/AddDriver";
import DriverProfile from "./DriverProfile";
import { MdDelete } from "react-icons/md";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars.jsx";
import AlertDialogSlide from "../../Components/AlertDialogSlide.jsx";
import { PacmanLoader } from "react-spinners";
import API_BASE_URL from "../../config/api";

export default function Driver() {
  const [openDriver, setOpenDriver] = useState(false);
  const status = ["All", "Online", "Offline", "On Trip"];
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [active, setActive] = useState("All");
  const [OpenProfile, setOpenProfile] = useState(false);
  const [data, setData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [DeleteData, setDeletedata] = useState("");
  const [driverAssigned, setDriverAssigned] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [driver, trip] = await Promise.all([getDriver(), TripsData()]);
        setDrivers(driver);
        setFilteredDrivers(driver);
        setTrips(trip);
      } catch (err) {
        setSnackbarMessage("Failed to load drivers");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    handleFilter(active, searchText);
  }, [drivers, active, searchText]);

  async function handleUpdateDriver(updatedvalue) {
    try {
      const oldvalue = drivers.find((d) => d._id === updatedvalue._id);
      const fields = [
        "name",
        "phone",
        "email",
        "profile",
        "status",
        "vehicleType",
        "vehicleNo",
      ];

      const isChange = fields.some(
        (field) => oldvalue[field] !== updatedvalue[field],
      );
      if (isChange) {
        await updateDriver(updatedvalue._id, updatedvalue);

        const updated = drivers.map((driver) => {
          if (driver._id === updatedvalue._id) {
            return { ...driver, ...updatedvalue };
          } else {
            return driver;
          }
        });

        setDrivers(updated);
        setData(updatedvalue);

        setSnackbarMessage("Driver updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("No changes made");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      }
    } catch (err) {
      let message = "Something went wrong";
      if (typeof err === "string") {
        message = err;
      } else if (err?.general) {
        message = err.general;
      } else if (err && typeof err === "object") {
        message = Object.values(err)[0];
      }
      setSnackbarMessage(message || "Update failed");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }

  async function handleDeleteDriver(value) {
    if (!value) return null;
    try {
      if (!trips.some((p) => p.driverId === value._id)) {
        await deleteDriver(value._id);
        await deleteUserDriver(value.email);
        setDrivers((prev) => prev.filter((d) => d._id !== value._id));
        setSnackbarMessage(
          `Driver "${value?.name || "Unknown"}" Deleted successfully!`,
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(
          "Driver is assigned to a trip and cannot be deleted.",
        );
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage(err?.message || "Failed to delete driver");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }

  function handleFilter(active, search) {
    let filter = [...drivers];
    if (search)
      filter = filter.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase().trim()),
      );
    if (active && active.toLowerCase() !== "all")
      filter = filter.filter(
        (d) => d.status.toLowerCase() === active.toLowerCase(),
      );
    setFilteredDrivers(filter);
  }

  return (
    <div className="driverManage-container">
      <div className="title-container">
        <div>
          <h1>Driver Management</h1>
          <p>Manage driver profiles, documents, and performance.</p>
        </div>
        <div className="left-container">
          <div className="search-div">
            <FaMagnifyingGlass className="search-icon" />
            <input
              type="text"
              placeholder="Search Driver..."
              value={searchText}
              onChange={(e) => {
                let value = e.target.value;
                setSearchText(value);
              }}
            />
          </div>
          <div>
            <button
              onClick={() => {
                setOpenDriver(true);
              }}
            >
              + Add New Driver
            </button>
          </div>
        </div>
      </div>
      <div className="driver-button-container">
        {status.map((value, index) => (
          <div key={index}>
            <button
              onClick={async () => {
                setActive(value);

                try {
                  const allDrivers = await getDriver();

                  setDrivers(allDrivers);

                  let filtered = allDrivers;

                  if (value.toLowerCase() !== "all") {
                    filtered = allDrivers.filter(
                      (d) =>
                        d.status &&
                        d.status.trim().toLowerCase() ===
                          value.trim().toLowerCase(),
                    );
                  }

                  setFilteredDrivers(filtered);
                } catch (err) {
                  console.error(err);
                  setSnackbarMessage("Failed to filter drivers");
                  setSnackbarSeverity("error");
                  setSnackbarOpen(true);
                }
              }}
              className={
                active === value ? "active-button" : "non-active-button"
              }
            >
              {value}
            </button>
          </div>
        ))}
      </div>
      <div className="driver-card-container">
        {loading ? (
          <div className="driver-loading-container">
            <PacmanLoader color="#1e40af" size={25} />
          </div>
        ) : filteredDrivers?.length > 0 ? (
          filteredDrivers.map((value) => (
            <div key={value._id} className="driver-card-details">
              <div className="driver-DeleteButton">
                <button
                  className="btnDelete"
                  title="Delete Driver"
                  onClick={() => {
                    setDeletedata(value);
                    setAlertDialogOpen(true);
                  }}
                >
                  <MdDelete />
                </button>
              </div>
              <div className="driver-info-container">
                <div className="driver-image-div">
                  {value?.profile ? (
                    <img src={value.profile} alt="" />
                  ) : (
                    <div
                      style={{ backgroundColor: getAvatarColor(value?.name) }}
                      className="driver-image-no-div"
                    >
                      <span>
                        {value?.name
                          ? value.name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)
                          : "NA"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="name-block">
                  <h2>{value?.name}</h2>
                  <p className="text-gray">
                    {value.state}
                    {value.city ? `, ${value.city}` : ""}
                  </p>
                  <div>
                    <span className="rating-star">
                      <span className="star">★</span>
                      {value.rating || " No ratings yet"}
                    </span>
                  </div>
                </div>
                <div className="bottom-card-block">
                  <div className="trip-joined">
                    <div className="driver-trip-card">
                      <span className="text-gray">TRIP</span>
                      {value.totalTrips ? (
                        <span>{value?.totalTrips}</span>
                      ) : (
                        <span>0</span>
                      )}
                    </div>
                    <div className="driver-join-card">
                      <span className="text-gray">JOINED</span>
                      <span>
                        {value.joinedDate
                          ? value?.joinedDate.split("T")[0]
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="driver-button-block">
                    <button
                      className="button-profile"
                      onClick={() => {
                        setOpenProfile(true);
                        setData(value);
                      }}
                    >
                      Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="driver-data-empty">
            <p>
              {searchText
                ? `No results for "${searchText}"`
                : "No Drivers Found"}
            </p>
          </div>
        )}
      </div>
      <AddDriver
        openDriver={openDriver}
        closeDriver={async (value) => {
          setOpenDriver(false);
          if (value) {
            const data = await getDriver();
            setDrivers(data);
            setSnackbarMessage(
              `Driver "${value.name || "Unknown"}" added successfully!`,
            );
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          }
        }}
      />
      <DriverProfile
        Open={OpenProfile}
        Data={data}
        Close={() => {
          setOpenProfile(false);
        }}
        updateDriver={(v) => {
          handleUpdateDriver(v);
        }}
      />
      <CustomizedSnackbars
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
      <AlertDialogSlide
        open={alertDialogOpen}
        onClose={() => setAlertDialogOpen(false)}
        onConfirm={() => {
          setAlertDialogOpen(false);
          handleDeleteDriver(DeleteData);
        }}
      />
    </div>
  );
}
