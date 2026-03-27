import Driver from "../models/Driver.js";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { PORT } from "../../client/src/services/driverService.js";

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

//  controller object
const driverController = {
  // ADD
  addDriver: async (req, res) => {
    try {
      const driver = new Driver(req.body);
      await driver.save();
      res.send("Driver added");
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  // GET
  getDrivers: async (req, res) => {
    try {
      const drivers = await Driver.find();
      res.json(drivers);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  // DELETE
  deleteDriver: async (req, res) => {
    try {
      const { id } = req.params;
      let driver = await Driver.findByIdAndDelete(id);

      if (!driver) {
        return res.status(404).send("Driver not found");
      }
      console.log(driver.profile, driver.license)
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

  //  multer middleware
  uploadMiddleware: upload.fields([
    { name: "profileFile", maxCount: 1 },
    { name: "licenseFile", maxCount: 1 },
  ]),

  // UPLOAD
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
