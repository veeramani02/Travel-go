import mongoose from "mongoose";
const loyaltySchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    activity:String,
    points:Number,
    createdAt:{
        type:Date,
        default:Date.now
    }
});
export default mongoose.model("Loyalty",loyaltySchema)