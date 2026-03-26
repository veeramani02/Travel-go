import express from "express"
import { createTrip } from "../controllers/TripController.js";
import { protect } from "../middleware/authMiddleware.js"
const triprouter=express.Router()
triprouter.post("/create",protect,createTrip);
export default triprouter