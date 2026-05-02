import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../../Styles/Salary.css";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { TbMoneybag } from "react-icons/tb";
import API_BASE_URL from "../../config/api";
import { TripsData } from "../../services/customerService";

export default function Salary() {
  const now = new Date();
  const year = now.getFullYear();
  const data = [
    { name: "January", earnings: 1800, pendings: 2000 },
    { name: "February", earnings: 2100, pendings: 2000 },
    { name: "March", earnings: 1700, pendings: 2200 },
    { name: "April", earnings: 2300, pendings: 2100 },
    { name: "May", earnings: 2500, pendings: 2400 },
    { name: "June", earnings: 2200, pendings: 2300 },
    { name: "July", earnings: 1900, pendings: 2000 },
    { name: "August", earnings: 2400, pendings: 2400 },
    { name: "September", earnings: 2600, pendings: 2500 },
    { name: "October", earnings: 2100, pendings: 2200 },
    { name: "November", earnings: 2800, pendings: 2500 },
    { name: "December", earnings: 3200, pendings: 3000 },
  ];
  const yearly = [year, year + 1, year + 2, year + 3];
  const Money = 2400;
  const pendingpay = 450;
  const [selectedMonth, setSelectedMonth] = useState(yearly[0]);
  const mon = selectedMonth;
  const [driver, setDriver] = useState([]);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, trip] = await Promise.all([
          fetch(`${API_BASE_URL}/api/driver/me`, {
            credentials: "include",
          }),
          TripsData(),
        ]);

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setDriver(data);
        console.log(data);
        setTrips(trip.filter((v) => v.driverId === data._id));
        console.log("trips", data);
      } catch (err) {
        console.error("Fetch error:", err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="salary-page-wrapper">
      <h1 className="salary-main-title">Salary Tracking</h1>
      <div className="salary-filter-container">
        <p>Filter by Year:</p>
        <select
          name="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {yearly.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className="salary-stats-grid">
        <div className="salary-stat-card s-total-card">
          <div className="s-moneybag">
            <TbMoneybag />
          </div>
          <div>
            <p>Total Earnings ({mon})</p>
            <h2>₹{driver?.payroll?.paidAmount}</h2>
          </div>
        </div>
        <div className="salary-stat-card s-pending-money">
          <div className="s-money-rup">
            <RiMoneyRupeeCircleFill />
          </div>
          <div>
            <p>Pending Money</p>
            <h2>
              ₹{driver?.payroll?.finalSalary - driver?.payroll?.paidAmount}
            </h2>
          </div>
        </div>
      </div>
      <div className="salary-chart-section">
        <h2 className="chart-heading">Monthly Earnings</h2>
        <div className="salary-bar-chart">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip />
              <Bar
                dataKey="earnings"
                fill="rgb(34, 197, 94)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pendings"
                fill="rgb(239, 68, 68)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="salary-history-table">
        <h2 className="table-heading">Payment History</h2>
        <div className="salary-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{driver.payroll?.month}</td>
                <td>Monthly Payout</td>
                <td className="salary-amt">₹{driver?.payroll?.paidAmount}</td>
                <td>
                  <span className="salary-status-badge">
                    {driver.payroll?.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
