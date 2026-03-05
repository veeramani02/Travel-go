import React,{useState} from 'react'
import '../../Styles/Driver.css'
import { FaMagnifyingGlass } from 'react-icons/fa6';
import {Data} from '../../Data/Data'
import AddDriver from '../../Pages/Admin/AddDriver';

export default function Driver() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter,setStatusFilter] = useState("");
  const [openDriver, setOpenDriver] = useState(false);
  
  const rowsPerPage = 5;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const status = [...new Set(Data.map(value=>value.status))]

  const filteredData = Data.filter((item) => {

  const matchesSearch =
    item.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
    item.id.startsWith(searchTerm);

  const matchesStatus =
    statusFilter === "" || item.status === statusFilter;

  return (
    matchesSearch &&
    matchesStatus
  );
});

  const currentRows = filteredData.slice(
  indexOfFirstRow,
  indexOfLastRow
  );

  const totalPages = Math.ceil(
      filteredData.length / rowsPerPage
  );

  return (
    <div className='driver-container'>
      <div className="title-container">
        <h1>Driver Management</h1>
        <div className='left-container'>
        <div className='search-div'>
            <FaMagnifyingGlass className="search-icon"/>
            <input type="text" placeholder='Search Driver...'
               value={searchTerm}
               onChange={(e) => {setSearchTerm(e.target.value);setCurrentPage(1);} }/>
        </div>
        <div>
            <button onClick={()=>{setOpenDriver(true)}}>+ Add New Driver</button>
        </div>
        </div>
      </div>
      <div className="status-container">
        <div>
        <label>Status</label>
        </div>
        <select name="" id=""
               value={statusFilter}
               onChange={(e) => {setStatusFilter(e.target.value)} }>
            <option value="">All Status</option>
            {status.map((value,index)=>(
                <option key={index} value={value}>{value}</option>
            ))}
        </select>
      </div>
      <div className="table-container">
        <table>
            <thead>
                <tr>
                    <th>Driver ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Vehicle</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {(filteredData.length === 0) ? (<tr>
                      <td colSpan="7" className="no-data">
                        "No Data Found"
                      </td>
                    </tr>
                ):(
                    currentRows.map((value,index)=>(
                    <tr key={index}>
                        <td>{value.id}</td>
                        <td>{value.name}</td>
                        <td>{value.phone}</td>
                        <td>{value.vehicle}</td>
                        <td>{value.rating}</td>
                        <td><span className={`status-pill ${value.status === "On Trip" ? "on-trip" : value.status.toLowerCase()}`}>{value.status}</span></td>
                        <td><button className='profile-btn'>View Profile</button></td>
                    </tr>
                )))}
            </tbody>
        </table>
      </div>
      <div className="table-footer">
              <div className="totalPage">
                Showing {indexOfFirstRow + 1} -{" "}
                {Math.min(indexOfLastRow, filteredData.length)} of{" "}
                {filteredData.length}
              </div>
              <div className="pagination">
                <button
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <span>Page {currentPage} of {totalPages}</span>
                      <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
              </div>
        </div>
        <AddDriver
          openDriver={openDriver}
          closeDriver={ ()=>{setOpenDriver(false)} }
        />
    </div>
  )
}
