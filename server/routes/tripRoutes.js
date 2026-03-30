import express from "express"
import { createTrip, getLatestTrip } from "../controllers/TripController.js";
import { protect } from "../middleware/authMiddleware.js"
const triprouter=express.Router()
triprouter.post("/create",protect,createTrip);
triprouter.get("/latest",protect,getLatestTrip)
export default triprouter