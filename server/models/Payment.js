import mongoose from "mongoose";
const paymentSchema= new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
            required:true,
        },
        trip:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Trip",
            required:true,
        },
        amount:{
            type:Number,
            required:true,
        },
        paymentMethod:{
            type:String,
            enum:["UPI","Card","NetBanking","Cash"],
            required:true,
        },
        paymentStatus:{
            type:String,
            enum:["pending","Completed","Failed"],
            default:"pending",
        },
        transcationId:{
            type:String,
        },
        paymentDate:{
            type:Date,
            default:Date.now,
        },

    },
    {timestamps:true}
);
export default moongose.model("payment",paymentSchema)