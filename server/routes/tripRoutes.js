import express from "express";
import {
  createTrip,
  getLatestTrip,
  getPastTrips,
  getRoute,
  getTrips,
  updateTrips,
  cancelTrip,
  getUpcomingTrips,
} from "../controllers/TripController.js";
import { protect } from "../middleware/authMiddleware.js";
const triprouter = express.Router();
triprouter.post("/create", protect, createTrip);
triprouter.get("/latest", protect, getLatestTrip);
triprouter.get("/upcoming", protect, getUpcomingTrips);
triprouter.get("/past-trips", protect, getPastTrips);
triprouter.get("/route", protect, getRoute);
triprouter.get("/trip", protect, getTrips);
triprouter.patch("/update", protect, updateTrips);
triprouter.patch("/cancel/:tripId", protect, cancelTrip);
export default triprouter;
