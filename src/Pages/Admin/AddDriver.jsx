import React,{useState,useRef} from 'react'
import '../../Styles/AddDriver.css'
import {Data} from '../../Data/Data';

export default function AddDriver({openDriver, closeDriver}) {
    const [isOn, setIsOn] = useState(true);
    const fileRef = useRef();
    const [fileName, setFileName] = useState("");
    const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    vehicleType: "",
    licensePlate: "",
    status: true,
});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

    const handleSubmit = () => {
        console.log("Driver Data:", formData);
        var status = "Inactive";
        if(formData.status) status = "Active";
        Data.push({
            id: `D-500${Data.length}`,
            name: formData.fullName,
            phone: formData.phone,
            vehicle: formData.licensePlate,
            rating: `${(Math.random()*6).toFixed(1)}/5`,
            status: status
        })
        closeDriver();
    };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) setFileName(file.name);
    };
  if(!openDriver) return null
  return (
    <div className='addDriver-container'>
      <div className='addDriver-body'>
        <h1 className='addDriver-title'>Add New Driver</h1>
        <p>Personal Details</p>
        <div className="personal-details">
            <div className="input">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id='fullName' name='fullName' placeholder='e.g John Doe' value={formData.fullName} onChange={handleChange} />
            </div>
            <div className="input">
                <label htmlFor="phone">Phone Number</label>
                <input type="number" id='phone' name='phone' placeholder='e.g 987654321' value={formData.phone} onChange={handleChange}/>
            </div>
            <div className="input">
                <label htmlFor="email">Email Address</label>
                <input type="email" id='email' name='email' placeholder='e.g JohnDoe@gmail.com' value={formData.email} onChange={handleChange}/>
            </div>
        </div>
        <p>Vehicle Information</p>
        <div className="vehicle-details">
            <div className="input">
                <label htmlFor="vehicleType">Vehicle Type</label>
                <select name="vehicleType" id="vehicleType">
                    <option value="">--Select--</option>
                </select>
            </div>
            <div className="input">
                <label htmlFor="licensePlate">License Plate Number</label>
                <input type="text" id='licensePlate' name='licensePlate' placeholder='e.g TN-01-XXXX' value={formData.licensePlate} onChange={handleChange}/>
            </div>
        </div>
        <p>Document & Status</p>
        <div className="document-info">
            
            <div className="input">
                <label htmlFor="dl">Driver License</label>
                <input type="file"
                id='dl'
                name='dl'
                ref={fileRef}
                style={{ display: "none" }}
                onChange={handleFile}/>
                <button
                    onClick={() => fileRef.current.click()}
                >
                    Upload File
                </button>
                {fileName && <p style={{display:"inline", marginLeft: "10px"}}>{fileName}</p>}
            </div>
            <div className="input">
                <label htmlFor="status">Status</label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                id='status'
                onClick={() => setIsOn(!isOn)}
                style={{
                    width: "46px",
                    height: "24px",
                    borderRadius: "50px",
                    backgroundColor: isOn ? "var(--primary)" : "#ccc",
                    position: "relative",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                }}
                >
                <div style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    position: "absolute",
                    top: "3px",
                    left: isOn ? "25px" : "3px",
                    transition: "left 0.3s",
                }} />
                </div>
                <span>Active/Inactive</span>
                </div>
            </div>
        </div>
        <div className="btn-div">
            <div className="btn">
                <button onClick={closeDriver}>Cancel</button>
            </div>
            <div className="btn">
                <button onClick={handleSubmit}>Add Driver</button>
            </div>
        </div>
      </div>
    </div>
  )
}
