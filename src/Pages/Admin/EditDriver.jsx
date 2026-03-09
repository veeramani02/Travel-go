import React,{useState,useEffect} from 'react'
import '../../Styles/EditDriver.css'


export default function EditDriver({Open, Close, Data, Onsave}) {
  
 const [formData, setFormData] = useState({});

 useEffect(() => {
  if (Data) {
    setFormData({
      name: Data.name,
      phone: Data.phone,
      email: Data.email,
      status: Data.status,
      vehiclemodel: Data.vehicleModel,
      licenseplate: Data.licensePlate,
      color: Data.vehicleColor
    });
  }
}, [Data]);

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value
  }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  Close();
};
  if(!Open || !Data) return null;
  return (
    <div className='editdriver-container-div'>
     
      <div className="editdriver-container">
        <form onSubmit={handleSubmit}>
         <h1>Edit Driver Profile</h1>
         <h3>Driver Info</h3>
         <div className="editdriver-input">
            <label htmlFor="name">Name</label>
            <input type="text" id='name' name='name' value={formData.name || ""} onChange={handleChange} />
         </div>
         <div className="editdriver-input">
            <label htmlFor="phone">Phone</label>
            <input type="text" id='phone' name='phone' value={formData.phone || ""} onChange={handleChange}/>
         </div>
         <div className="editdriver-input">
            <label htmlFor="email" >Email</label>
            <input type="email" id='email' name='email' value={formData.email || ""} onChange={handleChange}/>
         </div>
         <div className="editdriver-input">
            <label htmlFor="status">Status</label>
            <select name="status" id="status" value={formData.status || ""} onChange={handleChange} >
                <option value="">--select--</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
            </select>
         </div>
         <h3>Vehicle Info</h3> 
         <div className="editdriver-input">
             <label htmlFor="vehiclemodel">Vehicle Model</label>
             <input type="text" id='vehiclemodel' name='vehiclemodel' value={formData.vehiclemodel || ""} onChange={handleChange} />
         </div>
         <div className="editdriver-input">
             <label htmlFor="licenseplate">License Plate</label>
             <input type="text" name='licenseplate' id='licenseplate' value={formData.licenseplate || ""} onChange={handleChange}/>
         </div>
         <div className="editdriver-input">
             <label htmlFor="color">Color</label>
             <input type="text" name='color' id='color' value={formData.color || "white"} onChange={handleChange}/>
         </div>
         <div className="editdriver-button-div">
            <button type='submit'>Save</button>
            <button type="button" onClick={Close}>Close</button>
         </div>
         </form>
      </div>
    </div>
  )
}
