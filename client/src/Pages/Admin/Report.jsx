import React, { useEffect, useState } from "react";
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

import "../../Styles/Report.css";
import {
  getDriver,
  getVehicle,
  TripsData,
} from "../../services/customerService";

function Report() {
  const [range, setRange] = useState("weekly");

  /* Trip Data */

  const tripData = [
    { day: "Mon", completed: 40, cancelled: 4 },
    { day: "Tue", completed: 30, cancelled: 2 },
    { day: "Wed", completed: 20, cancelled: 5 },
    { day: "Thu", completed: 27, cancelled: 3 },
    { day: "Fri", completed: 18, cancelled: 1 },
    { day: "Sat", completed: 23, cancelled: 2 },
    { day: "Sun", completed: 34, cancelled: 6 },
  ];

  /* Vehicle Utilization */

  const vehicleData = [
    { name: "Bus", value: 25 },
    { name: "SUV", value: 30 },
    { name: "Sedan", value: 28 },
    { name: "Van", value: 17 },
  ];

  const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#f97316"];

  const reportData = [
    { name: "Total Fuel cost", value: "$12,450", cost: "+5.2% vs last month" },
    { name: "Maintenance Cost", value: "$3,200", cost: "-2.15% vs last month" },
    { name: "Driver Incentives", value: "$4,800", cost: "paid to 15 drivers" },
  ];
  const [customers, setCustomers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

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
      console.log(driver);
      console.log(customer);
    };
    fetchData();
  }, []);

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

          <Button className="reportExportBtn">Export PDF</Button>
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
      <div>
        <div className="detailed-header">
          <h1>Detailed Report</h1>
          <p>View All Data</p>
        </div>
        <div className="reportdata-card">
          {reportData.map((card, index) => (
            <div key={index} className="reportdatacard-value">
              <p>{card.name}</p>
              <h3>{card.value}</h3>
              <p>{card.cost}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Report;
