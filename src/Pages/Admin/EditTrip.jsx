import React, { useState, useEffect } from "react";
import '../../Styles/EditTrip.css'

export default function EditTrip({ isOpen, onClose, trip, type }) {

  

  const [formData, setFormData] = useState(null);
  

    useEffect(() => {
    if (trip) {
        setFormData(trip);
    }
    }, [trip]);

    
  if (!isOpen || !formData) return null;
  return ( 
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="h2">Edit Trip: #{trip.id}</h2>

        <div className="body">
            <h4 className="body-title">Passenger Details</h4>
            <form action="">
            <div className="input-div">
                <div className="input label">
                    <div>
                        <label htmlFor="">Name</label>
                    </div>
                    <input type="text" value={formData.passenger.name}
                            onChange={(e) =>
                            setFormData({
                                ...formData,
                                passenger: {
                                ...formData.passenger,
                                name: e.target.value
                                }
                            })
                            } />
                </div>
                <div className="input label">
                    <div>
                        <label htmlFor="">Phone</label>
                    </div>
                    <input type="text" value={formData.passenger.phone}
                                    onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        passenger: {
                                        ...formData.passenger,
                                        phone: e.target.value
                                        }
                                    })
                                    } />
                </div>
                <div className="input label">
                    <div>
                        <label htmlFor="">Email</label>
                    </div>
                    <input type="text" value={formData.passenger.email}
                                onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    passenger: {
                                    ...formData.passenger,
                                    email: e.target.value
                                    }
                                })
                                } />
                </div>
            </div>

            <div className="select label">
                    <div>
                        <label htmlFor="">Passenger Type</label>
                    </div>
                    <div>
                        <select
                                value={formData.passenger.type}
                                onChange={(e) =>
                                    setFormData({
                                    ...formData,
                                    passenger: {
                                        ...formData.passenger,
                                        type: e.target.value
                                    }
                                    })
                                }
                                >
                                {type.map((value, index) => (
                                    <option key={index} value={value}>
                                    {value}
                                    </option>
                                ))}
                                </select>
                    </div>
            </div>
            <div className="trip-info">
                <div className="address-div">
                    <div className="pickup-input label">
                        <div>
                            <label htmlFor="">Pickup Address</label>
                        </div>
                        <input type="text" value={trip.route.pickup} readOnly/>
                    </div>
                    <div className="drop-input label">
                        <div>
                            <label htmlFor="">Drop Off</label>
                        </div>
                        <input type="text" value={trip.route.dropoff} readOnly/>
                    </div>
                </div>
              <div className="date-div">
                <div className="label">
                    <div>
                        <label htmlFor="">Date</label>
                    </div>
                    <input type="date" value={trip.route.time.split(" ")[0]}/>
                </div>
                <div className="label">
                    <div>
                        <label htmlFor="">Time</label>
                    </div>
                    <select name="" id="">
                        <option value={trip.route.time.split(" ").slice(1).join(" ")}>{trip.route.time.split(" ").slice(1).join(" ")}</option>
                    </select>
                </div>
                <div className="label">
                    <div>
                        <label htmlFor="">Status</label>
                    </div>
                    <select name="" id="">
                        <option value={trip.status}>{trip.status}</option>
                    </select>
                </div>
                </div>
            </div>
          </form>
        </div>
         <div className="btn">
            <div>
                <button onClick={onClose}>Cancel</button>
            </div>
            <div>
                <button>Save Changes</button>
            </div>
         </div>
      </div>
    </div>
  );
}