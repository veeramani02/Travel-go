import React,{useState,useRef, useEffect} from 'react'
import '../../Styles/AddDriver.css'
import { addDriver, PORT } from '../../Data/Data';
import { CgProfile } from "react-icons/cg";

export default function AddDriver({openDriver, closeDriver}) {
    const [isOn, setIsOn] = useState(true);
    const Profileref = useRef();
    const Lisenceref = useRef();
    const [lisenceFile, setLisenceFile] = useState("");
    const [profileFile, setProfileFile] = useState("");
    const [profilePreview, setProfilePreview] = useState(null);
    const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    profile: "",
    vehicleType: "",
    licensePlate: "",
    drivingLicense: "",
    status: true,
});


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async () => {
    let {imageurl, lisenceurl} = ""
    try {
        if (profileFile) {
            const data = new FormData();
            data.append("profileFile", profileFile);
            const res = await fetch(`http://localhost:${PORT}/upload`, {
            method: "POST",
            body: data,
        });
            const result = await res.json();
            imageurl = result.url;
        }
        if (lisenceFile) {
            const data = new FormData();
            data.append("licenseFile", lisenceFile);
            const res = await fetch(`http://localhost:${PORT}/upload`, {
            method: "POST",
            body: data,
        });
            const result = await res.json();
            imageurl = result.url;
        } 
         
        
        const newData = {
            ...formData,
            profile: imageurl,
            lisence: lisenceurl, 
            status: isOn ? "Active" : "Inactive"
        };

        addDriver(newData);
        closeDriver(newData);
        console.log(newData)

    } catch (err) {
        console.error(err);
    }
  };

    const handleLisenceFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            alert("File size must be less than 2MB");
            return;
        }
        setLisenceFile(file);
    };
    const handleProfileFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            alert("File size must be less than 2MB");
            return;
        }
        if (file){ 
            setProfileFile(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        return () => {
            if (profilePreview) {
            URL.revokeObjectURL(profilePreview);
            }
        };
    }, [profilePreview]);

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
        <div className="addDriver-upload-picture">
            <h3>Profile Picture</h3>
            <div className="driver-profile-picture-section">
                 <div className='driver-profile-picture'>
                     <div className='addDriver-image'>{profilePreview ? (<img src={profilePreview} className='adddriverimage'/>) : (<CgProfile className='adddriverimage'/>)}</div>
                     <div className="upload-button-div">
                     <input type="file"
                        id='pf'
                        name='pf'
                        ref={Profileref}
                        style={{ display: "none" }}
                        onChange={handleProfileFile}
                        />
                        <button className='addDriver-upload-button' onClick={() => Profileref.current.click()}>Upload Profile</button>
                        <p style={{fontSize:"0.9rem", color:"gray"}}>Recommended: Square image, max 2MB</p>
                     </div>
                 </div>
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
                ref={Lisenceref}
                style={{ display: "none" }}
                onChange={handleLisenceFile}/>
                <button
                    onClick={() => Lisenceref.current.click()}
                >
                    Upload File
                </button>
                {lisenceFile && <p style={{display:"inline-block", marginTop:'10px'}} className='file-content'
                title={lisenceFile}
                >{lisenceFile}</p>}
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
                <button onClick={()=>closeDriver(null)}>Cancel</button>
            </div>
            <div className="btn">
                <button onClick={
                    ()=>{handleSubmit()}}>Add Driver</button>
            </div>
        </div>
      </div>
    </div>
  )
}
