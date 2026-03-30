import Trip from "../models/Trip.js";
export const createTrip=async (req,res)=>{
    try{
        const {
            name,
            phone,
            email,
            pickupState,
            pickupCity,
            destinationState,
            destinationCity,
            dateAndTime,
            vehicleType,
            passengers,
            specialRequest,
        }=req.body;
        const dateobj=new Date(dateAndTime)
        const date= dateobj
        const time=dateobj.toLocaleTimeString([],{
            hour:"2-digit",
            minute:"2-digit"
        })
        const baseprice=500
        const amount=baseprice*passengers
       const trip = await Trip.create({
  userId: req.user.id,

  name,
  phone,
  email,
  pickupState,
  pickupCity,
  destinationState,
  destinationCity,

  dateAndTime, 

  date,
  time,
  vehicleType,
  passengers,
  specialRequest,
  amount,

  status: "pending",
  paymentStatus: "pending",
});
        res.status(201).json({
            success:"true",
            message:"Trip created successfully",
            trip,
        });

    }

    catch(error){
            console.log(error)
            res.status(500).json({
                message:"Failed to create trip"
            })
    }
}
export const getLatestTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });

    if (!trip) {
      return res.status(404).json({ message: "No trips found" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};