import React, {useState} from 'react'
import '../../Styles/Trips.css'
import { LiaCarSideSolid } from "react-icons/lia";
import { GoDotFill } from "react-icons/go";
import { FaRegCircleDot } from "react-icons/fa6";
import "leaflet/dist/leaflet.css";
import TripMap from './TripMap';
import { Data, recentTripActivityData, Customers } from '../../Data/Data';
import { FiPhone } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";




export default function Trips() {
  
  const status = ['All', 'Active', 'Pending', 'Completed'];
  const [Active, setActive] = useState('All');
  const DateStyle = {
    color: "gray",
    fontSize: "0.7rem"
  }
  const getDriverDetails = (id) => {
    return Data.find(driver => driver.id === id);
  };
  const getCustomerDetails = (id) => {
    return Customers.find(customer => customer.id === id);
  };


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
                   <button className={Active === value ? "trip-active-button": ""}
                   onClick={()=>{setActive(value)}}
                   >{value}</button>
                </div>
              )
              )
            }
          </div>
        </div>
      </div>
      <div className="trips-body-container-div">
        <div className="trip-card-div-scroll">
        <div className="tripcard-container">
         {
         recentTripActivityData.map((value)=>(
          <div key={value.tripId} className="trips-card-container-div">
             <div className="trips-card-title-div">
              <div className="trips-card-icons">
               <div className='trips-icons'><LiaCarSideSolid className='trips-car-icons'/></div>
               <div className="trips-card-title">
                <h3>{value.licensePlate}</h3>
                <p style={DateStyle}><span>{value.date} <GoDotFill className='trips-time-dot'/> {value.time}</span></p>
               </div>
              </div>
              <div>
                <span className={`status-pill ${value.status.toLowerCase()}`}>{value.status}</span>
              </div>
             </div>
             <div className="trips-content-container">
             <div className="trips-pickup-dropoff-div">
              <div className="trips-pickup">
                 <div className="trips-pickup-dot">
                   <FaRegCircleDot style={{color:"#087f5b"}}/>
                 </div>
                 <div className="trip-pickup-content">
                   <p style={{color:"gray", fontSize:"1rem", fontWeight:"600"}}>PICKUP</p>
                   <p style={{fontWeight:"bold", fontSize:"0.9rem"}}>{value.source}</p>
                 </div>
              </div>
             
              <div className="trips-dropoff">
                 <div className="trips-dropoff-dot">
                   <FaRegCircleDot style={{color:"#fa5252"}}/>
                 </div>
                 <div className="trip-dropoff-content">
                   <p style={{color:"gray", fontSize:"1rem",fontWeight:"600"}}>DROPOFF</p>
                   <p style={{fontWeight:"bold", fontSize:"0.9rem"}}>{value.destination}</p>
                 </div>
              </div>
              </div>
             </div>
             <div className="trips-card-driver-info">
              <div className="trips-card-driver-icons-name">
                <div className="trips-card-driver-icon">
                    <img src={getDriverDetails(value.driverId)?.avatar} alt="" /> 
                </div>
                <div className="trips-card-driver-name">
                  <p>Driver</p>
                  <p>{getDriverDetails(value.driverId)?.name}</p>
                </div>
              </div>
              <div className="trips-card-driver-info-icons">
                <div className="trips-card-driver-phone-icon"><FiPhone/></div>
                <div className="trips-card-driver-message-icon"><FiMessageSquare/></div>
                <div className="trips-card-driver-threedot-icon"><BsThreeDots/></div>
              </div>
             </div>
             <div className="trips-card-customer-details">
              <div className="trips-card-customer-name">
                <p>Customer: {getCustomerDetails(value.customerId).name}</p>
              </div>
              <div className="trips-card-customer-cost">

              </div>
             </div>
             </div>
         ))
         }
      </div>
      </div>
      <div className="trips-map-container">
           <TripMap/>
      </div>
      </div>
    </div>
  )
}
