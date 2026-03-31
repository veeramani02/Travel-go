import express from "express"
import { createTrip, getLatestTrip, getPastTrips } from "../controllers/TripController.js";
import { protect } from "../middleware/authMiddleware.js"
const triprouter=express.Router()
triprouter.post("/create",protect,createTrip);
triprouter.get("/latest",protect,getLatestTrip)
triprouter.get("/past-trips",protect,getPastTrips)
export default triprouter