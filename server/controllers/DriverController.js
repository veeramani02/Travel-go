import Driver from "../models/Driver.js";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";

const PORT = 3000;

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

const driverController = {
  addDriver: async (req, res) => {
    try {
      let { name, phone, email, state, city, vehicleType, vehicleNo, license } =
        req.body;
      let errors = {};
      if (!name || name.trim().length < 3)
        errors.name = "Name must be at least 3 characters long";
      if (!phone) errors.phone = "Enter the Phone Number";
      let firstDigit = phone.toString()[0];
      let validateDigit = ["8", "7", "9", "6"];
      if (phone.toString().length !== 10 || !validateDigit.includes(firstDigit))
        errors.phone = "Invalid Phone Number";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email))
        errors.email = "Invalid Email Address";
      if (!state || !city) errors.state = "Select State and City";
      if (vehicleType) {
        if (!vehicleNo) errors.vehicleNo = "Enter the Vehicle Number";
      }
      if (!license) errors.license = "Upload a License Image";
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
      const driver = new Driver(req.body);
      await driver.save();
      res.json({ general: "Driver added" });
    } catch (err) {
      res.status(500).json({
        errors: { general: err.message },
      });
    }
  },

  getDrivers: async (req, res) => {
    try {
      const drivers = await Driver.find();
      res.json(drivers);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  updateDriver: async (req, res) => {
    try {
      const { id } = req.params;
      let { name, phone, email, state, city, vehicleType, vehicleNo } =
        req.body;
      let errors = {};
      if (!name || name.trim().length < 3)
        errors.name = "Name must be at least 3 characters long";
      if (!phone) errors.phone = "Enter the Phone Number";
      let firstDigit = phone.toString()[0];
      let validateDigit = ["8", "7", "9", "6"];
      if (phone.toString().length !== 10 || !validateDigit.includes(firstDigit))
        errors.phone = "Invalid Phone Number";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email))
        errors.email = "Invalid Email Address";
      if (!state || !city) errors.state = "Select State and City";
      if (vehicleType) {
        if (!vehicleNo) errors.vehicleNo = "Enter the Vehicle Number";
      }
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
      const drivers = await Driver.findByIdAndUpdate(id, req.body);
      if (!drivers) {
        return res.status(404).json({ message: "Driver not found" });
      }
      res.json(drivers);
    } catch (err) {
      res.status(500).send({
        errors: { general: err.message },
      });
    }
  },

  deleteDriver: async (req, res) => {
    try {
      const { id } = req.params;
      let driver = await Driver.findByIdAndDelete(id);

      if (!driver) {
        return res.status(404).send("Driver not found");
      }
      if (driver.profile) {
        const fileName = driver.profile.split("/uploads/")[1];
        const filePath = path.join(__dirname, "../uploads", fileName);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      if (driver.license) {
        const fileName = driver.license.split("/uploads/")[1];
        const filePath = path.join(__dirname, "../uploads", fileName);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.send("Driver deleted");
    } catch (err) {
      res.status(500).send("Error deleting driver");
    }
  },

  uploadMiddleware: upload.fields([
    { name: "profileFile", maxCount: 1 },
    { name: "licenseFile", maxCount: 1 },
  ]),

  uploadFiles: (req, res) => {
    try {
      let profileUrl = "";
      let licenseUrl = "";

      if (req.files?.profileFile) {
        const file = req.files.profileFile[0];
        profileUrl = `http://localhost:${PORT}/uploads/${file.filename}`;
      }

      if (req.files?.licenseFile) {
        const file = req.files.licenseFile[0];
        licenseUrl = `http://localhost:${PORT}/uploads/${file.filename}`;
      }

      res.json({ profileUrl, licenseUrl });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};

export default driverController;
