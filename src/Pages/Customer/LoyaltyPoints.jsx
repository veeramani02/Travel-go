import React from 'react'
import StarImage from "../../assets/star2.png"
import "../../Styles/LoyaltyPoints.css"

function LoyaltyPoints() {

  const RewardsPoint = 2000;

  const tableData = [
    {
      Id: '101',
      Date: 'Feb 26, 2026',
      Activity: 'Payment',
      Points: '+100'
    },
    {
      Id: '102',
      Date: 'Dec 25, 2025',
      Activity: 'Redeemed Voucher',
      Points: '-100'
    }
  ];

  return (
    <div className='loyalty-container'>

      <h1 className="loyalty-title">Reward Points</h1>

      {/* Reward Balance Card */}
      <div className="reward-card">
        <div className='circle'>
          <img src={StarImage} alt="reward-star" />
        </div>

        <div className="info">
          <p>Your reward balance</p>
          <h2>{RewardsPoint} Points</h2>
        </div>
      </div>

      {/* Redeem Section */}
      <p className='redeem-title'>Redeem Rewards</p>

      <div className="redeem-card">

        <div className="redeem-info">
          <div>
            <h4>20% Discount Voucher</h4>
            <p>(1500 pts)</p>
          </div>
          <button className="redeem-btn">Redeem</button>
        </div>

        <div className="redeem-info">
          <div>
            <h4>10% Discount Voucher</h4>
            <p>(1000 pts)</p>
          </div>
          <button className="redeem-btn">Redeem</button>
        </div>

        <div className="redeem-info">
          <div>
            <h4>5% Discount Voucher</h4>
            <p>(500 pts)</p>
          </div>
          <button className="redeem-btn">Redeem</button>
        </div>

      </div>

      {/* Points History Table */}
      <div className="loyalty-table-container">
        <h2 className='loyalty-table-title'>Points History</h2>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Activity</th>
              <th>Points</th>
            </tr>
          </thead>

          <tbody>
            {tableData.map(value => (
              <tr key={value.Id}>
                <td>{value.Date}</td>
                <td>{value.Activity} ({value.Id})</td>
                <td className={value.Points.includes('-') ? "points-negative" : "points-positive"}>
                  {value.Points}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  )
}

export default LoyaltyPoints