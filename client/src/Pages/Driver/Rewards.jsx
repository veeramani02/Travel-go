import React from 'react'
import '../../Styles/RewardsPoint.css'
import StarImage from '../../assets/star2.png'

export default function Rewards() {
    const RewardsPoint = 2000;
    const tableData = [
        {
            Id:'101',
            Date:'Oct 26,2023',
            Activity:'Trip Completion',
            Points:'+100'
        },
        {
            Id:'102',
            Date:'Oct 25,2023',
            Activity:'Redeemed Fuel Voucher',
            Points:'+100'
        }
    ];

  return (
    <div className='rewards-container'>
      <h1 className="title">Reward Points</h1>

      <div className="reward-card">
        <div className='circle'>
            <img src={StarImage} alt="" />
        </div>
        <div className="info">
            <p>Your reward's balance</p>
            <h1>{RewardsPoint} Points</h1>
        </div>
      </div>
      <p className='redeem-title'>Redeem Rewards</p>
      <div className="redeem-card">
        <div className="redeem-info">
            <div>
                <h4>20 Fuel Voucher</h4>
                <p >(1500 pts)</p>
            </div>
            <div>
                <button>Redeem</button>
            </div>
        </div>
        <div className="redeem-info">
            <div>
                <h4>20 Fuel Voucher</h4>
                <p>(1500 pts)</p>
            </div>
            <div>
                <button>Redeem</button>
            </div>
        </div>
        <div className="redeem-info">
            <div>
                <h4>20 Fuel Voucher</h4>
                <p>(1500 pts)</p>
            </div>
            <div>
                <button>Redeem</button>
            </div>
        </div>
      </div>
      
      <div className="table-container">
        <h2 className='table-title'>Points History</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Activity</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map(value=>(
                    <tr key={value.Id}>
                        <td>{value.Date}</td>
                        <td>{value.Activity} ({value.Id})</td>
                        <td>{value.Points}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  )
}