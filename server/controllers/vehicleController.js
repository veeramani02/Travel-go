import Vehicle from "../models/Vehicle.js";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { PORT } from "../../client/src/services/vehicleService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const vehicleController = {
  getVehicle: async (req, res) => {
    try {
      const vehicle = await Vehicle.find();
      res.status(200).json(vehicle);
    } catch (e) {
      res.status(500).json({
        errors: { message: e.message },
      });
    }
  },
  addVehicle: async (req, res) => {
    try {
      const vehicle = new Vehicle(req.body);
      await vehicle.save();
      res.status(200).json(vehicle);
    } catch (e) {
      res.status(500).json({
        errors: { message: e.message },
      });
    }
  },

  uploadMiddleware: upload.fields([
    { name: "frontViewFile", maxCount: 1 },
    { name: "sideViewFile", maxCount: 1 },
    { name: "interiorViewFile", maxCount: 1 },
    { name: "backViewFile", maxCount: 1 },
    { name: "documentFile", maxCount: 1 },
  ]),

  // UPLOAD
  uploadFiles: (req, res) => {
    try {
      let frontViewUrl = "";
      let sideViewUrl = "";
      let interiorViewUrl = "";
      let backViewUrl = "";
      let documentUrl = "";
      if (req.files?.frontViewFile) {
        const file = req.files.frontViewFile[0];
        frontViewUrl = `http://localhost:${PORT}/uploads/${file.filename}`;
      }

      if (req.files?.sideViewFile) {
        const file = req.files.sideViewFile[0];
        sideViewUrl = `http://localhost:${PORT}/uploads/${file.filename}`;
      }
      if (req.files?.interiorViewFile) {
        const file = req.files.interiorViewFile[0];
        interiorViewUrl = `http://localhost:${PORT}/uploads/${file.filename}`;
      }
      if (req.files?.backViewFile) {
        const file = req.files.backViewFile[0];
        backViewUrl = `http://localhost:${PORT}/uploads/${file.filename}`;
      }
      if (req.files?.documentFile) {
        const file = req.files.documentFile[0];
        documentUrl = `http://localhost:${PORT}/uploads/${file.filename}`;
      }

      res.json({
        frontViewUrl,
        sideViewUrl,
        interiorViewUrl,
        backViewUrl,
        documentUrl,
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  updateVehicle: async (req, res) => {
    try {
      const { id } = req.params;
      const vehicle = await Vehicle.findByIdAndUpdate(id, req.body);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (err) {
      res.status(500).send({
        errors: { message: err.message },
      });
    }
  },

  updateVehicleField: async (req, res) => {
    try {
      const updatedVehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true },
      );
      res.status(200).json(updatedVehicle);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  deleteVehicle: async (req, res) => {
    try {
      const { id } = req.params;
      let vehicle = await Vehicle.findByIdAndDelete(id);

      if (!vehicle) {
        return res.status(404).send("Vehicle not found");
      }
      if (vehicle.frontView) {
        const fileName = vehicle.frontView.split("/uploads/")[1];
        const filePath = path.join(__dirname, "../uploads", fileName);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      if (vehicle.sideView) {
        const fileName = vehicle.sideView.split("/uploads/")[1];
        const filePath = path.join(__dirname, "../uploads", fileName);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      if (vehicle.backView) {
        const fileName = vehicle.backView.split("/uploads/")[1];
        const filePath = path.join(__dirname, "../uploads", fileName);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      if (vehicle.interior) {
        const fileName = vehicle.interior.split("/uploads/")[1];
        const filePath = path.join(__dirname, "../uploads", fileName);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      if (vehicle.document) {
        const fileName = vehicle.document.split("/uploads/")[1];
        const filePath = path.join(__dirname, "../uploads", fileName);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.send("Vehicle deleted");
    } catch (err) {
      res.status(500).send("Error deleting driver");
    }
  },
};

export default vehicleController;
