import React, { useState } from "react";
import '../../Styles/Enquiries.css'
import { FiSearch, FiUser, FiCalendar, FiCheckCircle } from "react-icons/fi";
import TripviewDetails from "./TripviewDetails";
import EditTrip from "./EditTrip";
import AssignDriver from "./AssignDriver";

export default function Enquiries() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [driverFilter, setDriverFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [AssignOpen, setAssignOpen] = useState(false);
  const [AssignClose, setAssignClose] = useState(false);
  const tableData = [
  {
    id: "2040",
    status: "Completed",
    passenger: {
      name: "Salem Heights Hotel",
      email: "Hotel@gmail.com",
      type: "Regular",
      phone: "+91 98765 43210"
    },
    driver: {
      name: "David Smith",
      vehicle: "Sedan (TN-01-1234)",
      phone: "+91 98765 43211"
    },
    route: {
      path: "Salem Junction → Hotel",
      pickup: "Salem Junction, Railway Station",
      dropoff: "Salem Heights Hotel, Main Lobby",
      time: "2026-02-24 09:00 AM"
    },
    payment: {
      fare: 350,
      incentive: 20,
      fine: 0,
      total: 370,
      method: "Monthly Billing",
      status: "Invoiced"
    },
    history: [
      { date: "2026-02-24 09:45 AM", actor: "Driver David Smith", action: "Changed to Completed" }
    ]
  },
  {
    id: "2041",
    status: "Pending",
    passenger: {
      name: "Alike Dellc",
      email: "AlikeDellc@gmail.com",
      type: "Credit-Based",
      phone: "+91 98765 43220"
    },
    driver: {
      name: "Chris Smith",
      vehicle: "SUV (TN-01-5678)",
      phone: "+91 98765 43221"
    },
    route: {
      path: "Airport → City Center",
      pickup: "International Airport, Terminal 1",
      dropoff: "City Center Mall",
      time: "2026-02-24 10:30 AM"
    },
    payment: {
      fare: 850,
      incentive: 0,
      fine: 0,
      total: 850,
      method: "Credit-Based (Trip 1/3)",
      status: "Unpaid"
    },
    history: [
      { date: "2026-02-24 10:00 AM", actor: "System", action: "Enquiry Received" }
    ]
  },
  {
    id: "2042",
    status: "Completed",
    passenger: {
      name: "John Halo",
      email: "haloJohn@gmail.com",
      type: "Regular",
      phone: "+91 98765 43230"
    },
    driver: {
      name: "Berry Rothan",
      vehicle: "Van (TN-01-9012)",
      phone: "+91 98765 43231"
    },
    route: {
      path: "Chicago → Marma",
      pickup: "123 Chicago St.",
      dropoff: "456 Marma Ave.",
      time: "2023-05-23 08:00 PM"
    },
    payment: {
      fare: 450,
      incentive: 50,
      fine: 0,
      total: 500,
      method: "Monthly Billing",
      status: "Paid"
    },
    history: [
      { date: "2023-05-23 08:45 PM", actor: "Driver Berry Rothan", action: "Changed to Completed" }
    ]
  },
  {
    id: "2043",
    status: "Completed",
    passenger: {
      name: "Kibert Convert",
      email: "KCKing@gmail.com",
      type: "Credit-Based",
      phone: "+91 98765 43240"
    },
    driver: {
      name: "Chris Smith",
      vehicle: "SUV (TN-01-5678)",
      phone: "+91 98765 43221"
    },
    route: {
      path: "Chicago → Clematon",
      pickup: "789 Chicago West",
      dropoff: "101 Clematon Rd.",
      time: "2023-05-23 08:00 PM"
    },
    payment: {
      fare: 400,
      incentive: 15,
      fine: 0,
      total: 415,
      method: "Credit-Based (Trip 3/3)",
      status: "Paid"
    },
    history: [
      { date: "2023-05-23 09:10 PM", actor: "Driver Chris Smith", action: "Changed to Completed" }
    ]
  },
  {
    id: "2044",
    status: "Cancelled",
    passenger: {
      name: "Biorga Boine",
      email: "BBrobert@gmail.com",
      type: "Regular",
      phone: "+91 98765 43250"
    },
    driver: {
      name: "Grent Allana",
      vehicle: "Sedan (TN-01-3456)",
      phone: "+91 98765 43251"
    },
    route: {
      path: "Marma → Airport",
      pickup: "Marma Central",
      dropoff: "International Airport",
      time: "2023-05-23 08:00 PM"
    },
    payment: {
      fare: 0,
      incentive: 0,
      fine: 10,
      total: -10,
      method: "N/A",
      status: "Penalty Applied"
    },
    history: [
      { date: "2023-05-23 07:45 PM", actor: "Admin", action: "Cancelled - Late Cancellation Fine Applied" }
    ]
  },
  {
    id: "2045",
    status: "Allocated",
    passenger: {
      name: "Sarah Lee",
      email: "Lee@gmail.com",
      type: "Credit-Based",
      phone: "+91 98765 43260"
    },
    driver: {
      name: "David Smith",
      vehicle: "Sedan (TN-01-1234)",
      phone: "+91 98765 43211"
    },
    route: {
      path: "Salem Market → Bus Stand",
      pickup: "Salem Main Market",
      dropoff: "Central Bus Stand",
      time: "2026-02-24 11:00 AM"
    },
    payment: {
      fare: 200,
      incentive: 0,
      fine: 0,
      total: 200,
      method: "Credit-Based (Trip 2/3)",
      status: "Awaiting Completion"
    },
    history: [
      { date: "2026-02-24 10:45 AM", actor: "Admin", action: "Driver David Smith Assigned" }
    ]
  }
];

  const handleClose = () => {
            setIsClosing(true);
            setTimeout(() => {
                setIsModalOpen(false);
                setIsClosing(false);
            }, 300);
  };

  const handleAssignClose = () =>{
     setAssignClose(true)
     setTimeout(()=>{
      setAssignOpen(false);
      setAssignClose(false);
     },300)
  }

  const Drivers = [...new Set(tableData.map(item => item.driver.name))];
  const Status = [...new Set(tableData.map(item => item.status))];
  const date = [...new Set(tableData.map(item => item.route.time.split(" ")[0]))];
  const type = [...new Set(tableData.map(item => item.passenger.type))]
  const avaliableDriver = [...new Set(tableData.filter(item => item.status.toLowerCase() === "completed" || item.status.toLowerCase() === "cancelled")
  .map(item => item.driver.name))]

  const rowsPerPage = 5;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const filteredData = tableData.filter((item) => {

  const matchesSearch =
    item.passenger.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
    item.id.startsWith(searchTerm);

  const matchesStatus =
    statusFilter === "" || item.status === statusFilter;

  const matchesDriver =
    driverFilter === "" || item.driver.name === driverFilter;

  const matchesDate =
    dateFilter === "" || item.route.time.startsWith(dateFilter);

  return (
    matchesSearch &&
    matchesStatus &&
    matchesDriver &&
    matchesDate
  );
});

  const currentRows = filteredData.slice(
  indexOfFirstRow,
  indexOfLastRow
  );

  const totalPages = Math.ceil(
      filteredData.length / rowsPerPage
  );
 
  
 function handlePrintInvoice(trip){
  const totalAmount =
    trip.payment.fare +
    trip.payment.incentive -
    trip.payment.fine;

  const printWindow = window.open("", "_blank");
  const div = printWindow.document.createElement('div');
  div.innerHTML = `
    <html>
      <head>
        <title>Invoice - Trip #${trip.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
          }

          h1 {
            text-align: center;
          }

          .section {
            margin-top: 20px;
          }

          .row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }

          .total {
            font-weight: bold;
            font-size: 18px;
            margin-top: 10px;
          }

          hr {
            margin: 15px 0;
          }
        </style>
      </head>

      <body>
        <h1>Trip Invoice</h1>
        <hr/>

        <div class="section">
          <div><strong>Trip ID:</strong> ${trip.id}</div>
          <div><strong>Date:</strong> ${trip.route.time}</div>
        </div>

        <div class="section">
          <div><strong>Customer:</strong> ${trip.passenger.name}</div>
          <div><strong>Type:</strong> ${trip.passenger.type}</div>
          <div><strong>Route:</strong> ${trip.route.path}</div>
        </div>

        <div class="section">
          <div><strong>Driver:</strong> ${trip.driver.name}</div>
          <div><strong>Vehicle:</strong> ${trip.driver.vehicle}</div>
        </div>

        <div class="section">
          <h3>Billing Breakdown</h3>
          <div class="row">
            <span>Base Fare</span>
            <span>$${trip.payment.fare}</span>
          </div>
          <div class="row">
            <span>Incentive</span>
            <span>+$${trip.payment.incentive}</span>
          </div>
          <div class="row">
            <span>Fine</span>
            <span>-$${trip.payment.fine}</span>
          </div>
          <hr/>
          <div class="row total">
            <span>Total</span>
            <span>$${totalAmount}</span>
          </div>
          <div><strong>Status:</strong> ${trip.payment.status}</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }
        </script>

      </body>
    </html>
  `
  printWindow.document.body.appendChild(div);
  printWindow.document.close();
  
};
  
  return (
    <div className='enquiries-container'>
        <h1 className='title'>Enquiries & Trips List</h1>
        <div className="table-container">
          <div className="input-section">
            <div className="input-wrapper">
              <FiSearch className="input-icon" />
              <input type="text" placeholder="Search ID or Name" value={searchTerm}
               onChange={(e) => {setSearchTerm(e.target.value);setCurrentPage(1);} }/>
            </div>
            <div className="filter-input">

                <div className="input-wrapper">
                  <FiCalendar className="input-icon" />
                  <select value={dateFilter}
                      onChange={(e) => {
                        setDateFilter(e.target.value);
                        setCurrentPage(1);
                      }}>
                    <option value="">All Dates</option>
                    {date.map((value,index) => (
                      <option key={index}>{value}</option>
                    ))}
                  </select>
                </div>

                <div className="input-wrapper">
                  <FiCheckCircle className="input-icon" />
                  <select value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                          setCurrentPage(1);
                        }}>
                    <option value="">All Status</option>
                    {Status.map((value,index) => (
                      <option key={index}>{value}</option>
                    ))}
                  </select>
                </div>

                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <select value={driverFilter}
                      onChange={(e) => {
                        setDriverFilter(e.target.value);
                        setCurrentPage(1);
                      }}>
                    <option value="">All Drivers</option>
                    {Drivers.map((value,index) => (
                      <option key={index}>{value}</option>
                    ))}
                  </select>
                </div>

              </div>
          </div>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>Customer Name</th>
                  <th>Driver Name</th>
                  <th>Trip Route</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (<tr>
                      <td colSpan="7" className="no-data">
                        "No Data Found"
                      </td>
                    </tr>):(
                currentRows.map((value) => (
                  <tr key={value.id}>
                    <td>{value.id}</td>
                    <td>{value.passenger.name}</td>
                    <td>{value.driver.name}</td>
                    <td>{value.route.time}</td>
                    <td className="datetime">
                      <span className="date">
                        {value.route.time.split(" ")[0]}
                      </span>
                      {" "}
                      <span className="time">
                        {value.route.time.split(" ").slice(1).join(" ")}
                      </span>
                    </td>
                    <td><span className={`status-pill ${value.status.toLowerCase().split(" ")}`}>{value.status}</span></td>
                    <td>
                        <div className='button-container'>
                         <button onClick={() => {
                                  setSelectedRow(value);
                                  setIsModalOpen(true);
                                }}>View Details
                          </button>  
                         <button onClick={()=>{setAssignOpen(true); setSelectedRow(value);}}>Assign Driver</button>
                         </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
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
          </div>
        </div>
        <TripviewDetails
              isOpen={isModalOpen}
              trip={selectedRow}
              onClose={handleClose}
              isClosing={isClosing}
              onPrint={handlePrintInvoice}
              onEdit={() => {
                      setIsModalOpen(false);   
                      setEditOpen(true);       
                    }}
        />
        <EditTrip
              isOpen={editOpen}
              onClose={() => setEditOpen(false)}
              trip={selectedRow}
              type={type}
        />

        <AssignDriver
              isOpen={AssignOpen}
              onClose={handleAssignClose}
              Driver={avaliableDriver}
              trip={selectedRow}
              isClose={AssignClose}
        />
    </div>
  )
}
