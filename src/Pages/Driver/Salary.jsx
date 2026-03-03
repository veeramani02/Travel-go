import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import "../../Styles/Salary.css";

export default function Salary() {
  const [selectedMonth, setSelectedMonth] = useState('October 2023');
  
  const months = ['August 2023', 'September 2023', 'October 2023', 'November 2023', 'December 2023'];
  const data = [
    { name: 'Week 1', earnings: 480, target: 410 },
    { name: 'Week 2', earnings: 510, target: 390 },
    { name: 'Week 3', earnings: 370, target: 440 },
    { name: 'Week 4', earnings: 430, target: 530 },
  ];

  const Money = 2400;
  const pendingpay = 450;
  const mon = selectedMonth.slice(0, 3);

  const tableData = [
    { date: "Oct 27, 2023", description: "Weekly Payout", amount: 850, status: "Paid" },
    { date: "Oct 20, 2023", description: "Weekly Payout", amount: 580, status: "Paid" },
    { date: "Oct 18, 2023", description: "Weekly Payout", amount: 340, status: "Paid" }
  ];

  return (
    <div className='salary-page-wrapper'> {/* Wrapper class name updated */}
       <h1 className="salary-main-title">Salary Tracking</h1>
       
       <div className="salary-filter-container">
          <label>Filter by Month:</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
       </div>

       <div className="salary-stats-grid">
          <div className="salary-stat-card">
              <p>Total Earnings ({mon})</p>
              <h2>₹{Money}</h2>
          </div>
          <div className="salary-stat-card warning">
              <p>Pending Money</p>
              <h2>₹{pendingpay}</h2>
          </div>
       </div>

      <div className="salary-chart-section">
        <h2 className="chart-heading">Weekly Earnings</h2>
        <div className='salary-bar-chart'>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#374151" />
                    <XAxis dataKey="name" tick={{fill: '#9ca3af', fontSize: 12}} />
                    <YAxis tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip />
                    <Bar dataKey="earnings" fill="#1e40af" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
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
                    {tableData.map((val, idx) => (
                    <tr key={idx}>
                        <td>{val.date}</td>
                        <td>{val.description}</td>
                        <td className="salary-amt">₹{val.amount}</td>
                        <td><span className="salary-status-badge">{val.status}</span></td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}