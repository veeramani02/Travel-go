import React, { useState } from "react";
import "../../Styles/VehicleDetails.css";
import { useNavigate } from "react-router-dom";
function VehicleDetails() {
const navigate=useNavigate();
const [isEditing,setIsEditing] = useState(false);

const [vehicle,setVehicle] = useState({
type:"Minibus",
make:"Toyota",
model:"Hiace",
color:"White",
year:"2021",
license:"ABC-1234",
passengers:"12",
luggage:"10 standard bags",
fuel:"Petrol",
transmission:"Automatic",
ac:"Yes",
status:"Available",
insurance:"INSPOL-6789123"
});

/* IMAGE DATA (temporary static) */

const vehicleImages = {
front:"https://images.unsplash.com/photo-1590362891991-f776e747a588",
side:"https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
interior:"https://images.unsplash.com/photo-1503376780353-7e6692767b70",
back:"https://images.unsplash.com/photo-1493238792000-8113da705763"
};

const [mainImage,setMainImage] = useState(vehicleImages.front);

const handleChange = (e)=>{
setVehicle({
...vehicle,
[e.target.name]:e.target.value
});
};

return (

<div className="vehicleDetailsPage">

<h2 className="vehicleDetailsTitle">
Vehicle Details: {vehicle.make} {vehicle.model} [{vehicle.license}]
<span className="vehicleStatusBadge">{vehicle.status}</span>
</h2>

<div className="vehicleDetailsContainer">

{/* IMAGE SECTION */}

<div className="vehicleImageSection">

<div className="vehicleMainImage">
<img src={mainImage} alt="vehicle"/>
</div>

<div className="vehicleThumbnailRow">

<img
src={vehicleImages.front}
onClick={()=>setMainImage(vehicleImages.front)}
alt="front"
/>

<img
src={vehicleImages.side}
onClick={()=>setMainImage(vehicleImages.side)}
alt="side"
/>

<img
src={vehicleImages.interior}
onClick={()=>setMainImage(vehicleImages.interior)}
alt="interior"
/>

<img
src={vehicleImages.back}
onClick={()=>setMainImage(vehicleImages.back)}
alt="back"
/>

</div>

</div>


{/* DETAILS SECTION */}

<div className="vehicleInfoSection">

{/* BASIC INFO */}

<div className="vehicleCard">

<h3>Basic Information</h3>

<div className="vehicleInfoRow">
<label>Type</label>
{isEditing ? (
<input name="type" value={vehicle.type} onChange={handleChange}/>
) : (
<p>{vehicle.type}</p>
)}
</div>

<div className="vehicleInfoRow">
<label>Make</label>
{isEditing ? (
<input name="make" value={vehicle.make} onChange={handleChange}/>
) : (
<p>{vehicle.make}</p>
)}
</div>

<div className="vehicleInfoRow">
<label>Model</label>
{isEditing ? (
<input name="model" value={vehicle.model} onChange={handleChange}/>
) : (
<p>{vehicle.model}</p>
)}
</div>

<div className="vehicleInfoRow">
<label>Year</label>
{isEditing ? (
<input name="year" value={vehicle.year} onChange={handleChange}/>
) : (
<p>{vehicle.year}</p>
)}
</div>

<div className="vehicleInfoRow">
<label>License</label>
{isEditing ? (
<input name="license" value={vehicle.license} onChange={handleChange}/>
) : (
<p>{vehicle.license}</p>
)}
</div>

</div>


{/* SPECIFICATIONS */}

<div className="vehicleCard">

<h3>Vehicle Specifications</h3>

<div className="vehicleInfoRow">
<label>Passenger Capacity:</label>
{isEditing ? (
<input name="passengers" value={vehicle.passengers} onChange={handleChange}/>
) : (
<p>{vehicle.passengers}</p>
)}
</div>

<div className="vehicleInfoRow">
<label>Luggage Capacity:</label>
{isEditing ? (
<input name="luggage" value={vehicle.luggage} onChange={handleChange}/>
) : (
<p>{vehicle.luggage}</p>
)}
</div>

<div className="vehicleInfoRow">
<label>Fuel:</label>
{isEditing ? (
<input name="fuel" value={vehicle.fuel} onChange={handleChange}/>
) : (
<p>{vehicle.fuel}</p>
)}
</div>

<div className="vehicleInfoRow">
<label>Transmission:</label>
{isEditing ? (
<input name="transmission" value={vehicle.transmission} onChange={handleChange}/>
) : (
<p>{vehicle.transmission}</p>
)}
</div>

<div className="vehicleInfoRow">
<label>AC:</label>
{isEditing ? (
<input name="ac" value={vehicle.ac} onChange={handleChange}/>
) : (
<p>{vehicle.ac}</p>
)}
</div>

</div>


{/* STATUS */}

<div className="vehicleCard">

<h3>Status & Documentation</h3>

<div className="vehicleInfoRow">
<label>Status:</label>
{isEditing ? (
<input name="status" value={vehicle.status} onChange={handleChange}/>
) : (
<p>{vehicle.status}</p>
)}
</div>

<div className="vehicleInfoRow">
<label>Insurance:</label>
{isEditing ? (
<input name="insurance" value={vehicle.insurance} onChange={handleChange}/>
) : (
<p>{vehicle.insurance}</p>
)}
</div>

</div>


<div className="vehicleButtonRow">

{isEditing ? (
<button
className="vehicleSaveBtn"
onClick={()=>setIsEditing(false)}
>
Save
</button>
) : (
<button
className="vehicleEditBtn"
onClick={()=>setIsEditing(true)}
>
Edit Vehicle
</button>
)}
<button onClick={()=>navigate("/admin/vehicles")} className="vehicleBackBtn" >
    back to vehicle list
</button>

</div>

</div>

</div>

</div>

);

}

export default VehicleDetails;