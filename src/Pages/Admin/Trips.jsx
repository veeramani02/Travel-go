import React from 'react'
import '../../Styles/Trips.css'

export default function Trips() {
  
  const status = ['All', 'Active', 'Pending', 'Completed']
  
  return (
    <div className='trips-container-div'>
      <div className="trips-title-div">
        <div className="trips-title">
          <h1>Trip Management</h1>
          <p>Monitor active trips and assign drivers. Live tracking enabled.</p>
        </div>
        <div className="trips-button-div">
          <div className="trips-button">
            <button>+ New Trip</button>
          </div>
          <div className='trips-group-button-div'>
            {
              status.map((value,index)=>(
                <div key={index}>
                   <button>{value}</button>
                </div>
              )
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
