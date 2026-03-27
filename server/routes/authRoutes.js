import express from "express"
import { login,logout,signup } from "../controllers/authController.js";
const router = express.Router()
router.route("/login").post(login)
router.route("/signup").post(signup)
router.route("/logout").post(logout)
export default router