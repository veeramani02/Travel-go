import React from 'react'
import '../../Styles/AdminDashboard.css'
import {recentTripActivityData,revenueData, fleetData, Data} from '../../Data/Data'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {

const activeDrivers = Data.filter(value =>{ if(value.status.toLocaleLowerCase().trim() === "active") return value })
const onTrip = Data.filter(value =>{ if(value.status.toLocaleLowerCase().trim() === "on trip") return value })
const pendingRequest = recentTripActivityData.filter(value=>{if(value.status.toLocaleLowerCase().trim() === "pending") return value})

const stats = [
  { label: "Total Revenue", value: `Rs.6888.00` },
  { label: "Active Trips", value: onTrip.length },
  { label: "Active Drivers", value: activeDrivers.length },
  { label: "Pending Requests", value: pendingRequest.length }
];


function Edit() {
    console.log('edit...');
    
}

function View(){
    console.log('view...');
}

  return (
    <div className='admin-container'>
      <div className="title-div">
       <h1 className='title'>Dashboard Overview</h1>
       <div className='button-div'>
        <button>+ New Booking</button>
       </div>
       </div>
       <p>Welcome back, Admin. Here's what's happening today.</p>
       <div className="card-container">
            {stats.map((item, index) => (
                <div className="card-div" key={index}>
                <p>{item.label}</p>
                <h1>{item.value}</h1>
                </div>
            ))}
       </div>
       <div className='body-div'>
       <div className="chart-container">
       
        <div className='title-div'>
        <h2 className='chart-title'>Revenue Analytics</h2>
        <div className='filter-div'>
            <select name="filter" id="filter">
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="year">This Year</option>
            </select>
        </div>
        </div>
        <div className="scroll-chart">
        <div className='chart-div'>
          <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 0, right: 15, left: 10, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />

                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
        </div>
        </div>
        </div>
         <div className="cardStyle">
          <h2 className="status-title">Fleet Status</h2>
          {fleetData.map((value, index)=>{
            const percentage = (value.count / value.total) * 100;
            return(
            <div key={index} style={{ marginBottom: '20px' }}>
                 <div className='label-row'>
                   <span className='label'>{value.label}</span>
                   <span className='count'>{value.count}</span>
                 </div>
                 <div className='bar-background'>
                  <div className='bar-fill' style={{
                      width: `${percentage}%`,
                      backgroundColor: value.color
              }}></div>
                 </div>
            </div>
          )})}
        </div>
        </div>
       <div className="table-container">
        <h2 className='table-title'>Points History</h2>
        <table>
            <thead>
                <tr>
                    <th>Trip ID</th>
                    <th>User</th>
                    <th>Destination</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                 {recentTripActivityData.map(value=>(
                    <tr key={value.tripId}>
                        <td>{value.tripId}</td>
                        <td>{value.user}</td>
                        <td>{value.destination}</td>
                        <td>{value.date}</td>
                        <td><span className={`status-pill ${value.status.toLowerCase()}`}>{value.status}</span></td>
                        <td>
                            <div className='button'>
                                <div><button onClick={View}>View</button></div>
                                <div><button onClick={Edit}>Edit</button></div>
                            </div>
                        </td>
                    </tr>
                 ))}
            </tbody>
        </table>
      </div>
    </div>
  )
}
