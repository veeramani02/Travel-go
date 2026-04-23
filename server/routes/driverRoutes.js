import express from "express";
import driverController from "../controllers/driverController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
console.log("🔥 DRIVER ROUTES FILE LOADED");
const driverRoutes = express.Router();

driverRoutes.post("/add", protect,authorizeRoles("admin"), driverController.addDriver);
driverRoutes.get("/driver", protect,authorizeRoles("admin"), driverController.getDrivers);
driverRoutes.put("/update/:id", protect,authorizeRoles("admin"), driverController.updateDriver);
driverRoutes.delete("/delete/:id", protect,authorizeRoles("admin"), driverController.deleteDriver);

driverRoutes.post(
  "/uploads",
  protect,
  authorizeRoles("admin"),
  driverController.uploadMiddleware,
  driverController.uploadFiles,
);
driverRoutes.post("/online", protect, authorizeRoles("driver"), driverController.goOnline);
driverRoutes.post("/offline", protect, authorizeRoles("driver"), driverController.goOffline);
driverRoutes.post("/ping", protect, authorizeRoles("driver"), driverController.driverPing);
driverRoutes.get("/my-trips", protect, authorizeRoles("driver"), driverController.getDriverTrips);
driverRoutes.get("/me", protect, authorizeRoles("driver"), driverController.getDriverProfile);
driverRoutes.get("/me", (req, res) => {
  res.send("ME ROUTE WORKING");
});
export default driverRoutes;
