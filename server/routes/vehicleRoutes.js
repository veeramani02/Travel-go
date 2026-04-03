import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import vehicleController from "../controllers/vehicleController.js";

const vehicleRoutes = express.Router();

vehicleRoutes.post("/add", protect, vehicleController.addVehicle);
vehicleRoutes.get("/vehicle", protect, vehicleController.getVehicle);
vehicleRoutes.put("/update/:id", protect, vehicleController.updateVehicle);
vehicleRoutes.delete("/delete/:id", protect, vehicleController.deleteVehicle);
vehicleRoutes.patch(
  "/updatefield/:id",
  protect,
  vehicleController.updateVehicleField,
);
vehicleRoutes.post(
  "/uploads",
  protect,
  vehicleController.uploadMiddleware,
  vehicleController.uploadFiles,
);

export default vehicleRoutes;
