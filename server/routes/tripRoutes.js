import express from "express";
import {
  createTrip,
  getLatestTrip,
  getPastTrips,
  getRoute,
} from "../controllers/TripController.js";
import { protect } from "../middleware/authMiddleware.js";
const triprouter = express.Router();
triprouter.post("/create", protect, createTrip);
triprouter.get("/latest", protect, getLatestTrip);
triprouter.get("/past-trips", protect, getPastTrips);
triprouter.get("/route", protect, getRoute);
export default triprouter;
