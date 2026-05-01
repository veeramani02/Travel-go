import express from "express"
import { login,logout,signup,forgotPassword,resetPassword } from "../controllers/authController.js";
const router = express.Router()
router.route("/login").post(login)
router.route("/signup").post(signup)
router.route("/logout").post(logout)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)
export default router