import React from 'react'
import "../../Styles/Assignedtrips.css"
function AssignedTrips() {
  return (
 <div className="driver-assigned-section">

  <h2 className="driver-section-title">Assigned Trip</h2>

  <div className="driver-assigned-card">

    <div className="driver-assigned-info">
      <p><strong>Trip ID:</strong> 45892</p>
      <p><strong>Pickup:</strong> Chennai</p>
      <p><strong>Destination:</strong> Bangalore</p>
      <p><strong>Date:</strong> 20 Oct 2026</p>
      <p><strong>Status:</strong> Assigned</p>
    </div>

    <div className="driver-assigned-actions">
      <button className="driver-route-btn">
        View Route
      </button>
    </div>

  </div>
  <div className="driver-completed-section">

  <h2 className="driver-section-title">Completed Trips</h2>

  <div className="driver-table-wrapper">
    <table className="driver-table driver-completed-table">
      <thead>
        <tr>
          <th>Trip ID</th>
          <th>Date</th>
          <th>Route</th>
          <th>Earnings</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>45870</td>
          <td>15 Oct 2026</td>
          <td>Chennai → Hyderabad</td>
          <td>₹12,500</td>
         <td ><span className="driver-status-completed">Completed</span></td>
        </tr>
        <tr>
          <td>45865</td>
          <td>12 Oct 2026</td>
          <td>Bangalore → Mumbai</td>
          <td>₹18,000</td>
          <td ><span className="driver-status-completed">Completed</span></td>
        </tr>
      </tbody>
    </table>
  </div>

</div>

</div>
  )
}

export default AssignedTrips