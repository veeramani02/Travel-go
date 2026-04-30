import express from "express";
import driverController from "../controllers/driverController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const driverRoutes = express.Router();

driverRoutes.post(
  "/add",
  protect,
  authorizeRoles("admin"),
  driverController.addDriver,
);
driverRoutes.get(
  "/driver",
  protect,
  authorizeRoles("admin"),
  driverController.getDrivers,
);
driverRoutes.put(
  "/update/:id",
  protect,
  authorizeRoles("admin"),
  driverController.updateDriver,
);
driverRoutes.delete(
  "/delete/:id",
  protect,
  authorizeRoles("admin"),
  driverController.deleteDriver,
);

driverRoutes.post(
  "/uploads",
  protect,
  authorizeRoles("admin"),
  driverController.uploadMiddleware,
  driverController.uploadFiles,
);
driverRoutes.post(
  "/online",
  protect,
  authorizeRoles("driver"),
  driverController.goOnline,
);
driverRoutes.post(
  "/offline",
  protect,
  authorizeRoles("driver"),
  driverController.goOffline,
);
driverRoutes.post(
  "/ping",
  protect,
  authorizeRoles("driver"),
  driverController.driverPing,
);
driverRoutes.get(
  "/my-trips",
  protect,
  authorizeRoles("driver"),
  driverController.getDriverTrips,
);
driverRoutes.get(
  "/me",
  protect,
  authorizeRoles("driver"),
  driverController.getDriverProfile,
);
driverRoutes.patch("/driver/payroll/:id", protect, authorizeRoles("admin"), driverController.updatePayroll);
driverRoutes.post(
  "/online",
  protect,    
  authorizeRoles("driver"),
  driverController.goOnline,
);
driverRoutes.post(
  "/offline",
  protect,  
  authorizeRoles("driver"),
  driverController.goOffline,
);
driverRoutes.get(
  "/online",
  protect,
  authorizeRoles("admin"),
  driverController.getOnlineDrivers,
);
driverRoutes.get(
  "/status/:status",
  protect,
  authorizeRoles("admin"),
  driverController.getDriversByStatus
);
export default driverRoutes;
