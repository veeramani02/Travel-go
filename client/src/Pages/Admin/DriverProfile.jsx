import React, { useState } from 'react'
import '../../Styles/DriverProfile.css'
import EditDriver from './EditDriver';
import { getAvatarColor } from '../../Data/Data';

export default function DriverProfile({Open, Data, Close, updateDriver}) {
   
   const [openEdit, setOpenEdit] = useState(false);

    if(!Open || !Data) return null
    return (
    <div className='Driver-profile-container'>
      <div className='overflow-div'>
      <div className="Driver-profile-body">
        <div>
        <h1>Driver Profile</h1>
        </div>
        <div className="driver-profile-top-info">
          <div className="driver-photo-container">
               <div className="driver-photo-div">
                 { Data.avatar ? <img src={Data.avatar} alt="" /> : (<div 
                 style={{backgroundColor: getAvatarColor(Data.name)}}
                 className='driver-image-no-div'>
                <span>{Data.name.split(" ").map(w => w[0]).join("").slice(0,2)}</span></div>)}
               </div>
                 <h3>{Data?.name}</h3>
          </div>
          <div className="driver-account-info">
                <h3>Account Info</h3>
                <div className='account-details-div'>
                  <p>Driver ID:</p>
                  <p>{Data?.id}</p>
                </div>
                <div className='account-details-div'>
                  <p>Joined Date:</p>
                  <p>{Data?.joinedDate.split("T")[0]}</p>
                </div>
                <div className='account-details-div'>
                  <p>Status:</p>
                  <p>{Data?.status}</p>
                </div>
          </div>
          <div className="driver-vehicle-info">
                <h3>Vehicles Info</h3>
                <div className="vehicle-details-div">
                  <p>Vehicle Model:</p>
                  <p>{Data?.vehicleModel}</p>
                </div>
                <div className="vehicle-details-div">
                  <p>License Plate:</p>
                  <p>{Data?.licensePlate}</p>
                </div>
                <div className="vehicle-details-div">
                  <p>Color:</p>
                  <p>{Data?.vehicleColor}</p>
                </div>
          </div>
        </div>
        <div className="driver-profile-bottom-info">
          
          <div className="performance-container-div">
            <h3>Performance Stats</h3>
            <div className="performance-details-div">
              <p>Total Trip:</p>
              <p>{Data?.totalTrips}</p>
            </div>
            <div className="performance-details-div">
              <p>Ratings:</p>
              <p>{Data?.rating}/5</p>
            </div>
            <div className="performance-details-div">
              <p>Cancellation Rate:</p>
              <p>2%</p>
            </div>
          </div>

          <div className="contact-container-div">
          <h3>Contacts & Documents</h3>
          <div className="contact-details-div">
            <p>Phone:</p>
            <p>{Data?.phone}</p>
          </div>
          <div className="contact-details-div">
            <p>Email:</p>
            <p>{Data?.email}</p>
          </div>
          <div className="contact-details-div">
            <p>License Expiry:</p>
             <p>{Data?.licenseExpiry}</p>
          </div>
        </div>
        </div>
          <div className='Driverprofile-button'>
            <button onClick={()=>{setOpenEdit(true)}}>Edit</button>
            <button onClick={Close}>Close</button>
          </div>
      </div>
      </div>
      <EditDriver
      Open = {openEdit}
      Close = {()=>{setOpenEdit(false)}}
      Data = {Data}
      Onsave = {(value)=>{updateDriver(value)}}
      />
    </div>
  )
}
