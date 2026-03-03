import React from 'react'
import calendar from '../../assets/calendar.png'
import car from '../../assets/car.png'
import star from '../../assets/star.png'
import duedate from '../../assets/due-date.png'
import "../../Styles/CustomerDashboard.css"
import ooty from"../../assets/ooty.jpg"
import kodaikanal from '../../assets/kodaikanal.jpg'
import mahabalipuram from '../../assets/mahabalipuram.jpg'
import { useNavigate } from 'react-router-dom'
function CustomerDashboard() {
  const navigate=useNavigate()
  return (
    <div>
      <main>
      
      <section className='dashboard-header'>
        <p className='welcome-text'>Welcome back</p>
        <div className='primary-button'>
        <button onClick={()=>navigate("/customer/book-trip")}> 
          Book New Trip
        </button>
        </div> 
      </section>
  
      <section>
        <div className='card-wrapper' >
        <div className='card1'onClick={()=>navigate("/customer/my-trips")} >
        <div className='image-wrapper' >
          <img src={calendar} height="50px" width="50px" className='calendar'></img>
          <span className='card-text'>Upcoming Trip</span>
        </div>
        <div>
          <p>chennai to Madurai</p>
          <p>Tomorrow,9:00PM</p>
        </div>
        </div>
        <div className='card2' onClick={()=>navigate("/customer/my-trips")}>
          <div className='image-wrapper' >
            <img src={car} height="50px" width="50px" className='car'></img>
            <span className='card-text'>Total Trips</span>
          </div>
          <div>
            <p>24</p>
          </div>
        </div>
        <div className='card3' onClick={()=>navigate("/customer/LoyaltyPoints")} >
          <div className='image-wrapper'>
            <img src={star} height="40px" width="40px" className='star'></img>
            <span className='card-text'>Loyalty points</span>
           </div>
           <div>
             <p>320</p>
           </div>
        </div>
        <div className='card4'>
          <div className='image-wrapper'>
            <img src={duedate} height="50px" width="50px" className='due'></img>
            <span className='card-text'>Pending dues</span>
          </div>
          <div>
             Rs.2500
          </div>
        </div>
        </div>
      </section>
    {/* Upcoming Trip Section */}
<div className="upcoming-section">
  <h2>Upcoming Trip</h2>

  <div className="upcoming-card">

    {/* Left Side */}
    <div className="upcoming-left">
      <div className="row">
        <span className="label">From:</span>
        <span className="value">Chennai</span>
      </div>

      <div className="row">
        <span className="label">To:</span>
        <span className="value">Madurai</span>
      </div>

      <div className="row">
        <span className="label">Status:</span>
        <span className="status-badge">Driver Assigning</span>
      </div>
    </div>

    {/* Right Side */}
    <div className="upcoming-right">
      <div className="row">
        <span className="label">Date:</span>
        <span className="value">Jan 20, 2026 - 9:00 AM</span>
      </div>

      <div className="row">
        <span className="label">Vehicle:</span>
        <span className="value">SUV</span>
      </div>
    </div>

  </div>
</div>
{/* Bottom Section */}
<div className="bottom-section">

  {/* Trip History */}
  <div className="trip-history">
    <h2>Trip History</h2>

    <div className="history-card">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Route</th>
            <th>Vehicle</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>12 Jan</td>
            <td>Chennai → Trichy</td>
            <td>Sedan</td>
            <td>₹3,500</td>
          </tr>

          <tr>
            <td>05 Jan</td>
            <td>Madurai → Coimbatore</td>
            <td>SUV</td>
            <td>₹2,800</td>
          </tr>

          <tr>
            <td>28 Dec</td>
            <td>Coimbatore → Chennai</td>
            <td>Mini Van</td>
            <td>₹0</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  {/* Popular Destinations */}
  <div className="popular-section">
    <h2>Most Popular Destinations</h2>

    <div className="destination-wrapper">

      <div className="destination-card">
        <img
          src={ooty}
          alt="Ooty"
        />
        <h4>Ooty</h4>
        <button>Try Now</button>
      </div>

      <div className="destination-card">
        <img
          src={kodaikanal}
          alt="Kodaikanal"
        />
        <h4>Kodaikanal</h4>
        <button>Try Now</button>
      </div>

      <div className="destination-card">
        <img
          src={mahabalipuram}
          alt="Mahabalipuram"
        />
        <h4>Mahabalipuram</h4>
        <button>Try Now</button>
      </div>

    </div>
  </div>

</div>
    </main>
    </div>
  )
}

export default CustomerDashboard
 