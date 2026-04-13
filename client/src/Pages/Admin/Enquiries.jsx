import React, { useEffect, useState } from "react";
import "../../Styles/Enquiries.css";
import { FiSearch, FiUser, FiCalendar, FiCheckCircle } from "react-icons/fi";
import TripviewDetails from "./TripviewDetails";
import EditTrip from "./EditTrip";
import { getVehicle, TripsData } from "../../services/customerService";
import { getDriver } from "../../services/driverService";

export default function Enquiries() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [driverFilter, setDriverFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isClose, setIsClose] = useState(false);
  const driverMap = {};
  const vehicleMap = {};
  drivers.forEach((d) => {
    driverMap[d._id] = { id: d._id, Name: d.name, Phone: d.phone };
  });
  vehicles.forEach((v) => {
    vehicleMap[v._id] = {
      id: v._id,
      vehicleName: v.vehicleModel,
      vehicleNo: v.vehicleNo,
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      const [customer, driver, vehicle] = await Promise.all([
        TripsData(),
        getDriver(),
        getVehicle(),
      ]);
      setCustomers(customer);
      setDrivers(driver);
      setVehicles(vehicle);
    };
    fetchData();
  }, []);

  const handleClose = (value) => {
    if (value == "modal") {
      setIsClosing(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsClose(true);
      setTimeout(() => {
        setEditOpen(false);
        setIsClose(false);
      }, 300);
    }
  };

  const Drivers = [...new Set(drivers.map((item) => item.name))];
  const Status = [...new Set(customers.map((item) => item.status))];
  const date = [
    ...new Set(customers.map((item) => item?.dateAndTime?.split("T")[0])),
  ];
  const type = [...new Set(customers.map((item) => item?.vehicleType))];

  const rowsPerPage = 5;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const filteredData = customers.filter((item) => {
    const matchesSearch =
      item?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?._id.includes(searchTerm);

    const matchesStatus = statusFilter === "" || item.status === statusFilter;

    const matchesDriver =
      driverFilter === "" || driverMap[item?.driverId]?.Name === driverFilter;

    const matchesDate =
      dateFilter === "" || item.dateAndTime.includes(dateFilter);

    return matchesSearch && matchesStatus && matchesDriver && matchesDate;
  });

  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="enquiries-container">
      <div className="enquiries-title-button-container">
        <h1 className="title">Customer's Trip list</h1>
      </div>
      <div className="table-container">
        <div className="input-section">
          <div className="input-wrapper">
            <FiSearch className="input-icon" />
            <input
              type="text"
              placeholder="Search ID or Name"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="filter-input">
            <div className="input-wrapper">
              <FiCalendar className="input-icon" />
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Dates</option>
                {date.map((value, index) => (
                  <option key={index}>{value}</option>
                ))}
              </select>
            </div>

            <div className="input-wrapper">
              <FiCheckCircle className="input-icon" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Status</option>
                {Status.map((value, index) => (
                  <option key={index}>{value}</option>
                ))}
              </select>
            </div>

            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <select
                value={driverFilter}
                onChange={(e) => {
                  setDriverFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Drivers</option>
                {Drivers.map((value, index) => (
                  <option key={index}>{value}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Customer Name</th>
                <th>Driver Name</th>
                <th>Trip Route</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    "No Data Found"
                  </td>
                </tr>
              ) : (
                currentRows.map((value) => (
                  <tr key={value._id}>
                    <td>{value._id.slice(4, 8).toUpperCase()}</td>
                    <td>{value?.name}</td>
                    <td>
                      {driverMap[value?.driverId]?.Name || "Not Assigned"}
                    </td>
                    <td>
                      {value.pickupCity} → {value.destinationCity}{" "}
                    </td>
                    <td className="datetime">
                      {(() => {
                        const dt = value?.dateAndTime;
                        if (!dt) return "-";

                        const [date, time] = dt.split("T");
                        const cleanTime = time?.split(".")[0];

                        return (
                          <>
                            <span>{date}</span>
                            <span>{cleanTime}</span>
                          </>
                        );
                      })()}
                    </td>
                    <td>
                      <span
                        className={`status-pill ${value.status.toLowerCase().split(" ")}`}
                      >
                        {value.status}
                      </span>
                    </td>
                    <td>
                      <div className="button-container">
                        <button
                          onClick={() => {
                            setSelectedRow({
                              Data: value,
                              driverData: driverMap[value?.driverId],
                              vehicleData: vehicleMap[value?.vehicleId],
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="table-footer">
            <div className="totalPage">
              Showing {indexOfFirstRow + 1} -{" "}
              {Math.min(indexOfLastRow, filteredData.length)} of{" "}
              {filteredData.length}
            </div>
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <TripviewDetails
        isOpen={isModalOpen}
        trip={selectedRow}
        onClose={() => handleClose("modal")}
        isClosing={isClosing}
        onEdit={() => {
          setEditOpen(true);
        }}
      />
      <EditTrip
        isOpen={editOpen}
        onClose={() => handleClose("edittrip")}
        trip={selectedRow}
        type={type}
        isClose={isClose}
        onsave={(p) => {
          let tripData = customers.find((v) => p._id === v._id);
          if (
            tripData &&
            tripData.driverId === p.driverId &&
            tripData.vehicleId === p.vehicleId
          ) {
            return;
          }
          setCustomers((prev) =>
            prev.map((item) =>
              item._id === p._id
                ? { ...item, driverId: p.driverId, vehicleId: p.vehicleId }
                : item,
            ),
          );
          setSelectedRow((prev) =>
            prev?.Data?._id === p._id
              ? {
                  ...prev,
                  Data: {
                    ...prev.Data,
                    driverId: p.driverId,
                    vehicleId: p.vehicleId,
                  },
                  driverData: driverMap[p.driverId],
                  vehicleData: vehicleMap[p.vehicleId],
                }
              : prev,
          );
        }}
      />
    </div>
  );
}
