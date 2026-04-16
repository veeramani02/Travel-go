import express from "express"
import {
    createPayment,
    updatePaymentStatus,
    getUserPayments,
    getPaymentById
} from "../controllers/PaymentController.js"
import  { protect } from "../middleware/authMiddleware.js"
import { razorpay } from "../utils/razorpay.js"
import crypto from "crypto"
const PaymentRouter= express.Router()
PaymentRouter.post("/",protect,createPayment)
PaymentRouter.put("/:paymentId",protect,updatePaymentStatus)
PaymentRouter.get("/",protect,getUserPayments)
PaymentRouter.get("/:paymentId",protect,getPaymentById)
PaymentRouter.post("/create-order",async(req,res)=>{
    try{
        const{amount,tripId}=req.body;
        const options={
            amount:amount*100,
            currency:"INR", 
            receipt:`receipt_${tripId}`,
        };
        const order=await razorpay.orders.create(options);
        res.json({success:true,order,})
    }
    catch(error){
        console.log("CREATE ORDER ERROR:",error)
        res.status(500).json({message:error.message})
    }
})
PaymentRouter.post("/verify-payment",async(req,res)=>{  
    try{
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
        const body=razorpay_order_id+"|"+razorpay_payment_id;
        const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex");
        if(expectedSignature===razorpay_signature){
            res.json({success:true,message:"Payment verified successfully"})
        }
        else{
            res.status(400).json({success:false,message:"Invalid payment signature"})
        }
    }
    catch(error){   
        console.log("VERIFY PAYMENT ERROR:",error)  
    }
})
export default PaymentRouter;