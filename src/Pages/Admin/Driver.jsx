import React,{useState} from 'react'
import '../../Styles/Driver.css'
import { FaMagnifyingGlass } from 'react-icons/fa6';
import {Data} from '../../Data/Data'
import AddDriver from '../../Pages/Admin/AddDriver';
import PhoneImage from '../../assets/phone-call.png';

export default function Driver() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDriver, setOpenDriver] = useState(false);
  const status = [...new Set(Data.map(value=>value.status))]
  
  return (
    <div className='driverManage-container'>
      <div className="title-container">
        <div>
        <h1>Driver Management</h1>
        <p>Manage driver profiles, documents, and performance.</p>
        </div>
        <div className='left-container'>
        <div className='search-div'>
            <FaMagnifyingGlass className="search-icon"/>
            <input type="text" placeholder='Search Driver...'
               value={searchTerm}
               onChange={(e) => {setSearchTerm(e.target.value);} }/>
        </div>
        <div>
            <button onClick={()=>{setOpenDriver(true)}}>+ Add New Driver</button>
        </div>
        </div>
      </div>
      <div className="driver-button-container">
        <div>
          <button>All</button>
        </div>
        {status.map((value,index)=>(
          <div key={index}>
            <button>{value}</button>
          </div>
        ))}
      </div>
      <div className="driver-card-container">
        {Data.map(value=>(
          <div key={value.id} className="driver-card-details">
             <div className="driver-name">
              <div className="name-block">
               <h3>{value.name}</h3>
               <p className='text-gray'>{value.location}</p>
               <span  className='rating-star'><span className='star'>★</span>{value.rating}</span>
               </div>
               <div className="bottom-card-block">
               <div className="trip-joined">
                <div className="driver-trip-card">
                  <span className='text-gray'>TRIP</span>
                  <span>{value.totalTrips}</span>
                </div>
                <div className="driver-join-card">
                  <span className='text-gray'>JOINED</span>
                  <span>{value.joinedDate}</span>
                </div>
               </div>
               <div className="driver-button-block">
                <button>Profile</button>
                <div className='img-div'>
                <img src={PhoneImage} alt="" />
                </div>
               </div>
               </div>
             </div>
          </div>
        ))}
      </div>
        <AddDriver
          openDriver={openDriver}
          closeDriver={ ()=>{setOpenDriver(false)} }
        />
    </div>
  )
}
