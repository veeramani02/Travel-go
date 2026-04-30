import Driver from "../models/Driver.js";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import Trip from "../models/Trip.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
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

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        errors: { email: "Driver already exists with this email" },
      });
    }

  
    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "driver",
    });

    
    const driver = new Driver({
      ...req.body,
      password: hashedPassword,
      status: "offline", 
    });

    await driver.save();

    res.json({ general: "Driver added successfully" });
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
 updatePayroll: async (req, res) => {
  try {
    const { id } = req.params;

    const finalSalary =
      Number(req.body.baseSalary) +
      Number(req.body.incentive) +
      Number(req.body.bonus) -
      Number(req.body.deductions);

    const driver = await Driver.findByIdAndUpdate(
      id,
      {
        payroll: {
          month: req.body.month,
          status: req.body.status,
          paidDate: req.body.paidDate,
          baseSalary: Number(req.body.baseSalary),
          incentive: Number(req.body.incentive),
          bonus: Number(req.body.bonus),
          deductions: Number(req.body.deductions),
          finalSalary,
          paidAmount:
            req.body.status === "Paid"
              ? finalSalary
              : Number(req.body.paidAmount) || 0,
        },
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    res.status(200).json({
      message: "Payroll updated successfully",
      driver,
    });
  } catch (err) {
    res.status(500).json({
      message: "Payroll update failed",
      error: err.message,
    });
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
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      let profileUrl = "";
      let licenseUrl = "";

      if (req.files?.profileFile) {
        const file = req.files.profileFile[0];
        profileUrl = `${baseUrl}/uploads/${file.filename}`;
      }

      if (req.files?.licenseFile) {
        const file = req.files.licenseFile[0];
        licenseUrl = `${baseUrl}/uploads/${file.filename}`;
      }

      res.json({ profileUrl, licenseUrl });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  goOnline: async (req, res) => {
  try {
    console.log("REQ USER:", req.user);

    const driver = await Driver.findOne({ email: req.user.email });

    if (!driver) {
      console.log("DRIVER NOT FOUND ❌");
      return res.status(404).json({ message: "Driver not found" });
    }

    driver.status = "online";
    await driver.save();

    console.log("UPDATED DRIVER:", driver);

    res.json({ message: "You are online now", driver });
  } catch (err) {
    res.status(500).json({
      message: "Error going online",
      error: err.message,
    });
  }
},
 
  goOffline: async (req, res) => {
  try {
    console.log("REQ USER:", req.user); 

    const driver = await Driver.findOne({ email: req.user.email });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    driver.status = "offline";
    await driver.save();

    console.log("UPDATED DRIVER:", driver);

    res.json({ message: "You are offline now", driver });
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({
      message: "Error going offline",
      error: err.message,
    });
  }
},
  driverPing: async (req, res) => {
    try {
      const driverId = req.user._id;
      await Driver.findByIdAndUpdate(driverId, { lastseen: Date.now() });
      res.json({ message: "Ping received" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating last seen", error: err.message });
    }
  },
 getDriverTrips: async (req, res) => {
  try {
    const driver = await Driver.findOne({ email: req.user.email });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const trips = await Trip.find({
      driverId: driver._id.toString(),
    }).sort({ createdAt: -1 });

    res.json(trips);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching driver trips",
      error: err.message,
    });
  }
},
getDriverProfile: async (req, res) => {
    try {
     const driver = await Driver.findOne({ email: req.user.email });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  },
getDriverTrips: async (req, res) => {
  try {
    console.log("REQ USER:", req.user);

    if (!req.user || !req.user.email) {
      return res.status(401).json({
        message: "Unauthorized user",
      });
    }

    const driver = await Driver.findOne({
      email: req.user.email,
    });

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    console.log("DRIVER FOUND:", driver);

    const trips = await Trip.find({
      driverId: { $exists: true, $ne: null },
    }).sort({ createdAt: -1 });

    console.log("ALL DRIVER TRIPS:", trips);

    res.status(200).json(trips);
  } catch (err) {
    console.log("GET DRIVER TRIPS ERROR:", err);

    res.status(500).json({
      message: "Error fetching driver trips",
      error: err.message,
    });
  }
},
  getOnlineDrivers: async (req, res) => {
  try {
    const drivers = await Driver.find({ status: "online" }).select(
      "name phone profile vehicleType vehicleNo rating status lastseen"
    );
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching online drivers", error: err.message });
  }
},
getDriversByStatus: async (req, res) => {
  try {
    const { status } = req.params;

    let query = {};

    if (status.toLowerCase() !== "all") {
      query.status = status.toLowerCase();
    }

    const drivers = await Driver.find(query).select(
      "name phone profile vehicleType vehicleNo rating status lastseen state city totalTrips joinedDate"
    );

    res.json(drivers);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching drivers by status",
      error: err.message,
    });
  }
},
};

export default driverController;
