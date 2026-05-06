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
import { useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";

export default function AdminDashboard() {
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const userdata = useAuth();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [filter, setFilter] = useState("7");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
        setSnackbar({
          open: true,
          message: e.message,
          severity: "success",
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (trips) {
      const completedTrips = trips.filter(
        (item) => item.status === "completed",
      );
      const filtered = filterDataByDate(completedTrips, filter);
      const formatted = formatRevenueData(filtered, filter);
      setChartData(formatted);
    }
  }, [trips, filter]);

  const activeDrivers = drivers.filter(
    (value) => value?.status?.toLowerCase().trim() === "online",
  );
  const onTrip = trips.filter(
    (value) =>
      value?.status?.toLowerCase().trim() === "on trip" ||
      value?.status?.toLowerCase().trim() === "confirmed",
  );
  const pendingRequest = trips.filter(
    (value) => value?.driverId?.toLowerCase().trim() === "",
  );
  const Revenue = trips.filter((v) => v.paymentStatus.toLowerCase() === "paid");
  const totalRevenue = Revenue.reduce((t, v) => t + v.amount, 0);
  const stats = [
    {
      symbol: <TbMoneybag />,
      label: "Total Revenue",
      value: totalRevenue,
      color: "#22c55e",
      background: "#f0fdf4",
      navfun: () => navigate("/admin/payroll"),
    },
    {
      symbol: <IoCarOutline />,
      label: "Active Trips",
      value: onTrip.length,
      color: "#3b82f6",
      background: "#eff6ff",
      navfun: () => navigate("/admin/trips"),
    },
    {
      symbol: <TbUserCheck />,
      label: "Active Drivers",
      value: activeDrivers.length,
      color: "#3b82f6",
      background: "#eff6ff",
      navfun: () => navigate("/admin/driver"),
    },
    {
      symbol: <MdOutlinePendingActions />,
      label: "Pending Requests",
      value: pendingRequest.length,
      color: "#ef4444",
      background: "#fef2f2",
      navfun: () => navigate("/admin/customer"),
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

  const formatRevenueData = (data, filter) => {
    const grouped = {};

    data.forEach((item) => {
      const date = new Date(item.dateAndTime);

      let key;
      let sortValue;

      if (filter === "7") {
        key = date.toLocaleDateString("en-US", { weekday: "short" });
        sortValue = date.getDay();
      } else if (filter === "30") {
        key = date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        });
        sortValue = date.getTime();
      } else if (filter === "year") {
        key = date.toLocaleDateString("en-US", { month: "short" });
        sortValue = date.getMonth();
      }

      if (!grouped[key]) {
        grouped[key] = { revenue: 0, sortValue };
      }
      grouped[key].revenue += item.amount;
    });

    return Object.keys(grouped)
      .map((key) => ({
        day: key,
        revenue: grouped[key].revenue,
        sortValue: grouped[key].sortValue,
      }))
      .sort((a, b) => a.sortValue - b.sortValue)
      .map(({ day, revenue }) => ({ day, revenue }));
  };

  const filterDataByDate = (data, filter) => {
    const now = new Date();

    return data.filter((item) => {
      const itemDate = new Date(item.dateAndTime);

      if (filter === "7") {
        const last7Days = new Date();
        last7Days.setDate(now.getDate() - 7);
        return itemDate >= last7Days;
      }

      if (filter === "30") {
        const last30Days = new Date();
        last30Days.setDate(now.getDate() - 30);
        return itemDate >= last30Days;
      }

      if (filter === "year") {
        return itemDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  };

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
            onClick={item.navfun}
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
              <select
                name="filter"
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
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
                  data={chartData}
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
    </div>
  );
}
