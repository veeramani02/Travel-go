import User from "../models/user.js";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
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

const userController = {
  changePassword: async (req, res) => {
    let { currentPassword, newPassword } = req.body;
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Wrong current password" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.passwordChangedAt = new Date();
      await user.save();
      res.json({ message: "Password updated successfully" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      let { name, profile, emailNotify, smsNotify, pushNotify } = req.body;

      const user = await User.findByIdAndUpdate(id, req.body);
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      res.json(user);
    } catch (e) {
      console.log(e.message);
    }
  },

  uploadMiddleware: upload.fields([{ name: "profileFile", maxCount: 1 }]),

  uploadFiles: (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      let profileUrl = "";
      let licenseUrl = "";

      if (req.files?.profileFile) {
        const file = req.files.profileFile[0];
        profileUrl = `${baseUrl}/uploads/${file.filename}`;
      }

      res.json({ profileUrl });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};

export default userController;
