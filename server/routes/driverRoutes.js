import express from "express";
import driverController from "../controllers/driverController.js";
import { protect } from "../middleware/authMiddleware.js"

const driverRoutes = express.Router();

driverRoutes.post("/add", protect, driverController.addDriver);
driverRoutes.get("/driver", protect, driverController.getDrivers);
driverRoutes.delete("/delete/:id", protect, driverController.deleteDriver);

driverRoutes.post(
  "/uploads",
  protect,
  driverController.uploadMiddleware,
  driverController.uploadFiles
);

export default driverRoutes;