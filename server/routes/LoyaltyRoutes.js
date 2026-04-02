import express from "express"
import { getLoyaltyData, redeemVoucher } from "../controllers/LoyaltyController.js"
import  { protect } from "../middleware/authMiddleware.js"
const loyaltyrouter=express.Router()
loyaltyrouter.get("/",protect,getLoyaltyData)
loyaltyrouter.post("/redeem",protect,redeemVoucher)


export default loyaltyrouter