import express from "express"
import {
    createPayment,
    updatePaymentStatus,
    getUserPayments,
    getPaymentById
} from "../controllers/PaymentController.js"
import  { protect } from "../middleware/authMiddleware.js"
const PaymentRouter= express.Router()
PaymentRouter.post("/",protect,createPayment)
PaymentRouter.put("/:paymentId",protect,updatePaymentStatus)
PaymentRouter.get("/",protect,getUserPayments)
PaymentRouter.get("/:paymentId",protect,getPaymentById)

export default PaymentRouter;