import React,{useEffect, useState} from 'react'
import '../../Styles/Driver.css'
import { FaMagnifyingGlass } from 'react-icons/fa6';
import CustomizedSnackbars, {deleteDriver, getDriver} from '../../Data/Data'
import AddDriver from '../../Pages/Admin/AddDriver';
import DriverProfile from './DriverProfile';
import { MdDelete } from "react-icons/md";
import { getAvatarColor } from '../../Data/Data';

export default function Driver() {
  const [openDriver, setOpenDriver] = useState(false);
  const status = ['All', 'Active', 'Inactive','On Trip'];
  const [drivers, setDrivers] = useState([]);
  const [search ,setSearch] = useState([]);
  const [Active, setActive] = useState('All');
  const [OpenProfile, setOpenProfile] = useState(false);
  const [data, setData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(()=>{
    const fetchData = async () => {
    const data = await getDriver();
    setDrivers(data)
    setSearch(data)
  };
  fetchData();
  },[])

  function handleUpdateDriver(updatedDriver){
  const updatedList = drivers.map(driver =>
    driver.id === updatedDriver.id
      ? { ...driver, ...updatedDriver }
      : driver
  );

  setDrivers(updatedList);

  if (Active === "All") {
    setSearch(updatedList);
  } else {
    setSearch(
      updatedList.filter(driver => driver.status === Active)
    );
  }

  const updatedProfile = updatedList.find(
    driver => driver.id === updatedDriver.id
  );

  setData(updatedProfile);

}
 
  function handleFilter(filterValue){
    if(filterValue.toLowerCase() === 'all')
      setSearch(drivers)
    else
      setSearch(drivers.filter(value=>(value.status === filterValue)))
  }

  function inputFilter(input){
    setSearch(drivers.filter(value=>(
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
        
        {search.length !== 0 ? (search.map(value=>(
          <div key={value._id} className="driver-card-details"> 
          <div className='driver-DeleteButton'>
          <button 
                  className="btnDelete"
                  title='Delete Driver'
                  onClick={async ()=>{
                    console.log(value)
                    await deleteDriver(value._id)
                    const data = await getDriver();
                    setDrivers(data)
                    setSearch(data)
                    // console.log(value)
                    setSnackbarMessage(`Driver "${value?.name || "Unknown"}" Deleted successfully!`);
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);
                  }}
                >
                  <MdDelete />
                </button>
                </div>
             <div className="driver-info-container">
              <div className="driver-image-div">
              { value.profile ? <img src={value.profile} alt="" /> : (<div  
                style={{backgroundColor: getAvatarColor(value.name)}}
                className='driver-image-no-div'>
                <span>{value.name.split(" ").map(w => w[0]).join("").slice(0,2)}</span></div>)}
             </div>
             {console.log(value)}
              <div className="name-block">
               <h2>{value.name}</h2>
               <p className='text-gray'>{value.location}</p>
               <div><span className='rating-star'><span className='star'>★</span>{value.rating ? value.rating:' No ratings yet'}</span></div>
               </div>
               <div className="bottom-card-block">
               <div className="trip-joined">
                <div className="driver-trip-card">
                  <span className='text-gray'>TRIP</span>
                  {value.totalTrips ? <span>{value.totalTrips}</span> : <span>0</span>}
                </div>
                <div className="driver-join-card">
                  <span className='text-gray'>JOINED</span>
                  <span>{value.joinedDate.split("T")[0]}</span>
                </div>
               </div>
               <div className="driver-button-block">
                <button className='button-profile' onClick={()=>{setOpenProfile(true);
                  setData(value)
                }}>Profile</button>
        
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
          closeDriver={ async (value)=>{
            setOpenDriver(false)
            const data = await getDriver();
                    setDrivers(data)
                    setSearch(data)
                    if(value){
                      setSnackbarMessage(`Driver "${value.fullName || "Unknown"}" added successfully!`);
                      setSnackbarSeverity('success');
                      setSnackbarOpen(true);
                    }
            
          }}
        />
        <DriverProfile
          Open={OpenProfile}
          Data={data}
          Close={()=>{setOpenProfile(false)}}
          updateDriver={handleUpdateDriver}
        />
        <CustomizedSnackbars
          open={snackbarOpen}
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
/>
    </div>
  )
}
