import Payment from "../models/Payment";
import Trip from "../models/Trip";
export const createPayment=async (req,res)=>{
    try{
        const {tripId,amount,paymentMethod}=req.body;
        const userId=req.user.id;
        const trip=await Trip.findById(tripId);
        if(!trip){
            return res.json({message:"Trip not found"})
        }
        const payment=new Payment({
            userId,
            tripId,
            amount,
            paymentMethod
        })
        await payment.save();
        res.status(201).json({
            message:"payment created successfully",
            payment,
        })

    }
    catch(error){
        res.status(500).json({message:error.message})
    }
}