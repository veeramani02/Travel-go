import express from "express"
import { applyVoucher,getMyVouchers } from "../controllers/VoucherController.js"
import { protect } from "../middleware/authMiddleware.js"
const  voucherRoute=express.Router();
voucherRoute.post("/apply",protect,applyVoucher)
voucherRoute.get("/my",protect,getMyVouchers)
export default voucherRoute