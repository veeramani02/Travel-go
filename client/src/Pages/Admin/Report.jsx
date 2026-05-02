import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import "../../Styles/report.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { PieChart, Pie, Cell } from "recharts";
import {
  getDriver,
  getVehicle,
  TripsData,
} from "../../services/customerService";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";
import { CSVLink } from "react-csv";

function Report() {
  const [range, setRange] = useState("weekly");
  let bus = 0,
    suv = 0,
    sedan = 0,
    van = 0,
    lc = 0;
  const [tripData, setTripData] = useState([]);
  const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#f97316"];
  const reportData = [
    { name: "Total Fuel cost", value: "$12,450", cost: "+5.2% vs last month" },
    { name: "Maintenance Cost", value: "$3,200", cost: "-2.15% vs last month" },
    { name: "Driver Incentives", value: "$4,800", cost: "paid to 15 drivers" },
  ];
  const [customers, setCustomers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  vehicles.forEach((v) => {
    let vehicleType = v?.vehicleType?.toLowerCase().trim();
    switch (vehicleType) {
      case "bus":
        bus++;
        break;
      case "suv":
        suv++;
        break;
      case "sedan":
        sedan++;
        break;
      case "van":
        van++;
        break;
      case "luxury coach":
        lc++;
        break;
    }
  });
  const vehicleData = [
    { name: "Bus", value: bus },
    { name: "SUV", value: suv },
    { name: "Sedan", value: sedan },
    { name: "Van", value: van },
    { name: "Luxury Coach", value: lc },
  ];
  const csvRef = useRef();
  const getWeeklyData = (trips) => {
    const result = {
      Mon: { day: "Mon", completed: 0, cancelled: 0 },
      Tue: { day: "Tue", completed: 0, cancelled: 0 },
      Wed: { day: "Wed", completed: 0, cancelled: 0 },
      Thu: { day: "Thu", completed: 0, cancelled: 0 },
      Fri: { day: "Fri", completed: 0, cancelled: 0 },
      Sat: { day: "Sat", completed: 0, cancelled: 0 },
      Sun: { day: "Sun", completed: 0, cancelled: 0 },
    };

    trips.forEach((trip) => {
      const d = new Date(trip.dateAndTime);

      const dayName = d.toLocaleDateString("en-US", {
        weekday: "short",
      });

      if (trip.status === "completed") {
        result[dayName].completed++;
      } else if (trip.status === "cancelled") {
        result[day].cancelled++;
      }
    });
    return Object.values(result);
  };

  const getMonthlyData = (trips) => {
    const result = {};
    const now = new Date();

    trips.forEach((trip) => {
      const d = new Date(trip.dateAndTime);

      if (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      ) {
        const day = d.getDate();
        const month = d.toLocaleDateString("en-US", { month: "short" });

        if (!result[day]) {
          result[day] = { day: `${day} ${month}`, completed: 0, cancelled: 0 };
        }

        if (trip.status === "completed") {
          result[day].completed++;
        } else if (trip.status === "cancelled") {
          result[day].cancelled++;
        }
      }
    });

    return Object.values(result).sort((a, b) => a.day - b.day);
  };

  const getYearlyData = (trips) => {
    const result = {
      Jan: { day: "Jan", completed: 0, cancelled: 0 },
      Feb: { day: "Feb", completed: 0, cancelled: 0 },
      Mar: { day: "Mar", completed: 0, cancelled: 0 },
      Apr: { day: "Apr", completed: 0, cancelled: 0 },
      May: { day: "May", completed: 0, cancelled: 0 },
      Jun: { day: "Jun", completed: 0, cancelled: 0 },
      Jul: { day: "Jul", completed: 0, cancelled: 0 },
      Aug: { day: "Aug", completed: 0, cancelled: 0 },
      Sep: { day: "Sep", completed: 0, cancelled: 0 },
      Oct: { day: "Oct", completed: 0, cancelled: 0 },
      Nov: { day: "Nov", completed: 0, cancelled: 0 },
      Dec: { day: "Dec", completed: 0, cancelled: 0 },
    };

    const now = new Date();
    const currentYear = now.getFullYear();

    trips.forEach((trip) => {
      const d = new Date(trip.dateAndTime);

      if (d.getFullYear() === currentYear) {
        const monthName = d.toLocaleDateString("en-US", {
          month: "short",
        });

        if (trip.status === "completed") {
          result[monthName].completed++;
        } else if (trip.status === "cancelled") {
          result[day].cancelled++;
        }
      }
    });

    return Object.values(result);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customer, driver, vehicle] = await Promise.all([
          TripsData(),
          getDriver(),
          getVehicle(),
        ]);
        setCustomers(customer);
        setDrivers(driver);
        setVehicles(vehicle);
        console.log(driver);
        console.log(vehicle);
        console.log(customer);
      } catch (e) {
        setSnackbar({
          open: true,
          message: e.message,
          severity: "error",
        });
      }
    };
    fetchData();
  }, []);

  const processData = () => {
    switch (range) {
      case "weekly":
        return getWeeklyData(customers);
      case "monthly":
        return getMonthlyData(customers);
      case "yearly":
        return getYearlyData(customers);
      default:
        return [];
    }
  };

  useEffect(() => {
    if (!customers.length) return;
    setTripData(processData());
  }, [range, customers]);

  const handleDownload = () => {
    csvRef.current.link.click();
  };

  return (
    <div className="reportPage">
      {/* HEADER */}

      <div className="reportHeader">
        <h1 className="reportTitle">Analytics & Reports</h1>

        <div className="reportHeaderActions">
          <ButtonGroup variant="contained" className="reportButtonGroup">
            <Button
              className="reportFilterBtn"
              onClick={() => setRange("weekly")}
            >
              Weekly
            </Button>

            <Button
              className="reportFilterBtn"
              onClick={() => setRange("monthly")}
            >
              Monthly
            </Button>

            <Button
              className="reportFilterBtn"
              onClick={() => setRange("yearly")}
            >
              Yearly
            </Button>
          </ButtonGroup>

          <Button className="reportExportBtn" onClick={handleDownload}>
            Export PDF
          </Button>
          <CSVLink
            data={processData()}
            filename="report.csv"
            ref={csvRef}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* CHARTS */}

      <div className="reportChartsContainer">
        {/* BAR CHART */}

        <div className="reportChartCard">
          <h3 className="reportChartTitle">Trip Statistics</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tripData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar dataKey="completed" fill="#2563eb" name="Completed Trips" />

              <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled Trips" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}

        <div className="reportChartCard">
          <h3 className="reportChartTitle">Vehicle Utilization</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vehicleData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
              >
                {vehicleData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <CustomizedSnackbars
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}
export default Report;
