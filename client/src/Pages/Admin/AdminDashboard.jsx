import React, { useEffect, useState } from "react";
import "../../Styles/AdminDashboard.css";
import { revenueData } from "../../Data/Data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TbMoneybag } from "react-icons/tb";
import { TbUserCheck } from "react-icons/tb";
import { IoCarOutline } from "react-icons/io5";
import { getDriver } from "../../services/driverService";
import { TripsData, vehicleData } from "../../services/customerService";
import { useAuth } from "../../Context/AuthContext";
import { MdOutlinePendingActions } from "react-icons/md";

export default function AdminDashboard() {
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const userdata = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driverRes, tripRes, vehicleRes] = await Promise.all([
          getDriver(),
          TripsData(),
          vehicleData(),
        ]);
        setDrivers(driverRes || []);
        setTrips(tripRes || []);
        setVehicles(vehicleRes || []);
      } catch (e) {
        console.error(e.message);
      }
    };
    fetchData();
  }, []);

  const activeDrivers = drivers.filter(
    (value) => value?.status?.toLowerCase().trim() === "active",
  );
  const onTrip = trips.filter(
    (value) =>
      value?.status?.toLowerCase().trim() === "on trip" ||
      value?.status?.toLowerCase().trim() === "confirmed",
  );
  const pendingRequest = trips.filter(
    (value) => value?.driverId?.toLowerCase().trim() === "",
  );

  const stats = [
    {
      symbol: <TbMoneybag />,
      label: "Total Revenue",
      value: `Rs.6888.00`,
      color: "#22c55e",
      background: "#f0fdf4",
    },
    {
      symbol: <IoCarOutline />,
      label: "Active Trips",
      value: onTrip.length,
      color: "#3b82f6",
      background: "#eff6ff",
    },
    {
      symbol: <TbUserCheck />,
      label: "Active Drivers",
      value: activeDrivers.length,
      color: "#3b82f6",
      background: "#eff6ff",
    },
    {
      symbol: <MdOutlinePendingActions />,
      label: "Pending Requests",
      value: pendingRequest.length,
      color: "#ef4444",
      background: "#fef2f2",
    },
  ];

  let avaliable = 0;
  let Trip = 0;
  let Maintenance = 0;
  let outOfService = 0;

  vehicles.forEach((v) => {
    let status = v?.status?.toLowerCase().trim();
    switch (status) {
      case "available":
        avaliable++;
        break;
      case "on trip":
      case "in-use":
        Trip++;
        break;
      case "maintenance":
        Maintenance++;
        break;
      case "out of service":
        outOfService++;
        break;
      default:
        break;
    }
  });

  const fleetData = [
    {
      label: "Available",
      count: avaliable,
      total: vehicles.length,
      color: "#10b981",
    },
    {
      label: "On Trip",
      count: Trip,
      total: vehicles.length,
      color: "#3b82f6",
    },
    {
      label: "Maintenance",
      count: Maintenance,
      total: vehicles.length,
      color: "#f59e0b",
    },
    {
      label: "Out of Service",
      count: outOfService,
      total: vehicles.length,
      color: "#ef4444",
    },
  ];

  return (
    <div className="admin-container">
      <div className="title-div">
        <div>
          <h1 className="title">Dashboard Overview</h1>
          <p>
            Welcome back, <span>{userdata.user.name}👋</span> Here's what's
            happening today.
          </p>
        </div>
      </div>

      <div className="card-container">
        {stats.map((item, index) => (
          <div
            className="card-div"
            key={index}
            style={{ borderLeftColor: item.color }}
          >
            <div
              className="card-symbol"
              style={{ color: item.color, background: item.background }}
            >
              {item.symbol}
            </div>
            <div>
              <p className="ad-label">{item.label}</p>
              <h1 className="ad-value">{item.value}</h1>
            </div>
          </div>
        ))}
      </div>
      <div className="body-div">
        <div className="chart-container">
          <div className="title-div">
            <h2 className="chart-title">Revenue Analytics</h2>
            <div className="filter-div">
              <select name="filter" id="filter">
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
          <div className="scroll-chart">
            <div className="chart-div">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={revenueData}
                  margin={{ top: 0, right: 15, left: 10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eee"
                  />

                  <XAxis dataKey="day" axisLine={false} tickLine={false} />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="cardStyle">
          <h2 className="status-title">Fleet Status</h2>
          {fleetData.map((value, index) => {
            const percentage = (value.count / value.total) * 100;
            return (
              <div key={index} style={{ marginBottom: "20px" }}>
                <div className="label-row">
                  <span className="label">{value.label}</span>
                  <span className="count">{value.count}</span>
                </div>
                <div className="bar-background">
                  <div
                    className="bar-fill"
                    style={{
                      width: percentage ? `${percentage}%` : "0%",
                      backgroundColor: value.color,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className="table-container">
        <h2 className="table-title">Points History</h2>
        <table>
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>User</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recentTripActivityData.map((value) => (
              <tr key={value.tripId}>
                <td>{value.tripId}</td>
                <td>{value.user}</td>
                <td>{value.destination}</td>
                <td>{value.date}</td>
                <td>
                  <span className={`status-pill ${value.status.toLowerCase()}`}>
                    {value.status}
                  </span>
                </td>
                <td>
                  <div className="button">
                    <div>
                      <button onClick={View}>View</button>
                    </div>
                    <div>
                      <button onClick={Edit}>Edit</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}
