import React, { useEffect, useState } from "react";
import "../../Styles/Driver.css";
import { FaMagnifyingGlass } from "react-icons/fa6";
import {
  deleteDriver,
  getDriver,
  getAvatarColor,
} from "../../services/driverService.js";
import AddDriver from "../../Pages/Admin/AddDriver";
import DriverProfile from "./DriverProfile";
import { MdDelete } from "react-icons/md";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars.jsx";

export default function Driver() {
  const [openDriver, setOpenDriver] = useState(false);
  const status = ["All", "Active", "Inactive", "On Trip"];
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [active, setActive] = useState("All");
  const [OpenProfile, setOpenProfile] = useState(false);
  const [data, setData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDriver();
      setDrivers(data);
      setFilteredDrivers(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    handleFilter(active, searchText);
  }, [drivers, active, searchText]);

  function handleUpdateDriver(updatedDriver) {
    const updatedList = drivers.map((driver) =>
      driver._id === updatedDriver._id
        ? { ...driver, ...updatedDriver }
        : driver,
    );

    setDrivers(updatedList);

    const updatedProfile = updatedList.find(
      (driver) => driver._id === updatedDriver._id,
    );

    setData(updatedProfile);
  }

  function handleFilter(active, search) {
    let filter = drivers;
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
              onClick={() => {
                setActive(value);
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
        {filteredDrivers?.length !== 0 ? (
          filteredDrivers.map((value) => (
            <div key={value._id} className="driver-card-details">
              <div className="driver-DeleteButton">
                <button
                  className="btnDelete"
                  title="Delete Driver"
                  onClick={async () => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete?",
                    );
                    if (!confirmDelete) return;
                    await deleteDriver(value._id);
                    setDrivers((prev) =>
                      prev.filter((d) => d._id !== value._id),
                    );
                    setFilteredDrivers((prev) =>
                      prev.filter((d) => d._id !== value._id),
                    );
                    setSnackbarMessage(
                      `Driver "${value?.name || "Unknown"}" Deleted successfully!`,
                    );
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                  }}
                >
                  <MdDelete />
                </button>
              </div>
              <div className="driver-info-container">
                <div className="driver-image-div">
                  {value.profile ? (
                    <img src={value.profile} alt="" />
                  ) : (
                    <div
                      style={{ backgroundColor: getAvatarColor(value.name) }}
                      className="driver-image-no-div"
                    >
                      <span>
                        {value.name
                          ?.split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="name-block">
                  <h2>{value.name}</h2>
                  <p className="text-gray">{value.location}</p>
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
                        <span>{value.totalTrips}</span>
                      ) : (
                        <span>0</span>
                      )}
                    </div>
                    <div className="driver-join-card">
                      <span className="text-gray">JOINED</span>
                      <span>
                        {value.joinedDate
                          ? value.joinedDate.split("T")[0]
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
            <p>"No Drivers Found"</p>
          </div>
        )}
      </div>
      <AddDriver
        openDriver={openDriver}
        closeDriver={async (value) => {
          setOpenDriver(false);
          const data = await getDriver();
          setDrivers(data);
          if (value) {
            setSnackbarMessage(
              `Driver "${value.fullName || "Unknown"}" added successfully!`,
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
        updateDriver={handleUpdateDriver}
      />
      <CustomizedSnackbars
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </div>
  );
}
