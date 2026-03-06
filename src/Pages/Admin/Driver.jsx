import React,{useState} from 'react'
import '../../Styles/Driver.css'
import { FaMagnifyingGlass } from 'react-icons/fa6';
import {Data} from '../../Data/Data'
import AddDriver from '../../Pages/Admin/AddDriver';

export default function Driver() {
  const [openDriver, setOpenDriver] = useState(false);
  const status = ['All', 'Active', 'Inactive','On Trip'];
  const [filterSearch ,setFilterSearch] = useState(Data);
  const [Active, setActive] = useState('All');

  function handleFilter(filterValue){
    if(filterValue.toLowerCase() === 'all')
      setFilterSearch(Data)
    else
      setFilterSearch(Data.filter(value=>(value.status === filterValue)))
  }

  function inputFilter(input){
    setFilterSearch(Data.filter(value=>(
      value.name.toLowerCase().trim().includes(input.toLowerCase().trim()
    ))))
  }
  
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
               onChange={(e) => {inputFilter(e.target.value)}}/> 
        </div>
        <div>
            <button onClick={()=>{setOpenDriver(true)}}>+ Add New Driver</button>
        </div>
        </div>
      </div>
      <div className="driver-button-container">
        {status.map((value,index)=>(
          <div key={index}>
            <button onClick={()=>
              {
                handleFilter(value)
                setActive(value)
              }
              }
              className={Active === value ? 'active-button': 'non-active-button'}
              >{value}</button>
          </div>
        ))}
      </div>
      <div className="driver-card-container">
        
        {filterSearch.length !== 0 ? (filterSearch.map(value=>(
          <div key={value.id} className="driver-card-details"> 
             <div className="driver-info">
              <div className="driver-image-div">
                <img src={value.avatar} alt="" />
             </div>
              <div className="name-block">
               <h3>{value.name}</h3>
               <p className='text-gray'>{value.location}</p>
               <div><span className='rating-star'><span className='star'>★</span>{value.rating}</span></div>
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
               </div>
               </div>
             </div>
          </div>
        ))) : (
          <div className='driver-data-empty'>
            <p>"No Drivers Found"</p>
          </div>
        )}
      </div>
        <AddDriver
          openDriver={openDriver}
          closeDriver={ ()=>{setOpenDriver(false)} }
        />
    </div>
  )
}
