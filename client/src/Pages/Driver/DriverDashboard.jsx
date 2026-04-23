import React, { useState,useEffect } from 'react'
import CarImage from '../../assets/drivercar.png'
import MoneyImage from '../../assets/money.png'
import FlagImage from '../../assets/flag.svg'
import "../../Styles/DriverDashboard.css"
import API_BASE_URL from "../../config/api";

export default function Driver() {
  const [status,setStatus]=useState("offline")
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/driver/me`, {
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      setStatus(data.status); 
    });
}, []);
console.log(API_BASE_URL)
  const goOnline = async () => {
  alert("You are going online 🚖");

  await fetch(`${API_BASE_URL}/api/driver/online`, {
    method: "POST",
    credentials: "include"
  });

  setStatus("online");
};
const goOffline = async () => {
  await fetch(`${API_BASE_URL}/api/driver/offline`, {
    method: "POST",
    credentials: "include"
  });

  setStatus("offline");
};
  return (
    <div className='driver-container'>

      <h1 className="driver-title">Driver Dashboard</h1>
   {status === "offline" ? (
  <button onClick={goOnline}>Go Online</button>
) : (
  <button onClick={goOffline}>Go Offline</button>
)}
      {/* Summary Cards */}
      <div className='driver-cards'>

        <div className='driver-card'>
          <div className='driver-circle'>
            <img src={CarImage} alt="distance" />
          </div>
          <div className="driver-info">
            <p className="driver-label">Total Distance (Month)</p>
            <h2 className="driver-value">1,540 km</h2>
          </div>
        </div>

        <div className='driver-card'>
          <div className='driver-circle'>
            <img src={MoneyImage} alt="money" />
          </div>
          <div className="driver-info">
            <p className="driver-label">Money Earn (Month)</p>
            <h2 className="driver-value">₹25,000</h2>
          </div>
        </div>

        <div className='driver-card'>
          <div className='driver-circle'>
            <img src={FlagImage} alt="trips" />
          </div>
          <div className="driver-info">
            <p className="driver-label">Trips Completed (Month)</p>
            <h2 className="driver-value">20</h2>
          </div>
        </div>

      </div>

      <div className='driver-table-section'>

        <div className='driver-recent'>
          <p className="driver-recent-title">Recent Trips</p>

          <div className="driver-table-wrapper">
            <table className="driver-table driver-recent-table">
              <thead>
                <tr>
                  <th>Trip Id</th>
                  <th>Date</th>
                  <th>Route</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>39393</td>
                  <td>17 Oct</td>
                  <td>Chennai → Bangalore</td>
                  <td>In Progress</td>
                </tr>
                <tr>
                  <td>39394</td>
                  <td>15 Oct</td>
                  <td>Mumbai → Pune</td>
                  <td>Completed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="driver-upcoming">
          <p className="driver-upcoming-title">Upcoming Assignments</p>

          <div className="driver-table-wrapper">
            <table className="driver-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Task</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>17 Oct</td>
                  <td>Delivery to Warehouse X</td>
                </tr>
                <tr>
                  <td>20 Oct</td>
                  <td>Delivery to Client Y</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  )
}

