import express from "express"
import { applyVoucher } from "../controllers/VoucherController.js"
import { protect } from "../middleware/authMiddleware.js"
const  voucherRoute=express.Router();
voucherRoute.post("/apply",protect,applyVoucher)
export default voucherRoute