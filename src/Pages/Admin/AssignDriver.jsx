import React,{useState} from 'react'
import '../../Styles/AssignDriver.css'

export default function AssignDriver({isOpen, onClose, Driver, trip, isClose}) {
  if(!isOpen || !trip) return null
  const [selectedDriver, setSelectedDriver] = useState("");
  return (
    <div className='modal-overlay'>
      <div className={`adddriver-modal ${isClose? "close" : "open"}`}>
      <h1 className='assign-content'>Assign Driver to Trip #{trip.id}</h1>
      <div className="input-driver">
        <div>
            <label htmlFor="SelectDriver">Select Driver</label>
        </div>
        <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                >
                <option value="">Select Driver</option>
                {Driver.map((value, index) => (
                    <option key={index} value={value}>
                    {value}
                    </option>
                ))}
                </select>
      </div>
      <div className='btn'>
        <div>
            <button onClick={onClose}>Cancel</button>
        </div>
        <div>
            <button>Confirm Assignment</button>
        </div>
      </div>
     </div>
    </div>
  )
}
