import express from "express"
import { getCustomerDashboard } from "../controllers/customerDashboard.js"
import { protect } from "../middleware/authMiddleware.js"

const custRouter = express.Router()
custRouter.get("/customer",protect,getCustomerDashboard)
export default custRouter