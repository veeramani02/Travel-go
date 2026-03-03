import React from 'react'
import CarImage from '../../assets/drivercar.png'
import MoneyImage from '../../assets/money.png'
import FlagImage from '../../assets/flag.svg'
import "../../Styles/DriverDashboard.css"

export default function Driver() {
  return (
    <div className='driver-container'>

      <h1 className="driver-title">Driver Dashboard</h1>

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

      {/* Table Section */}
      <div className='driver-table-section'>

        {/* Recent Trips */}
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