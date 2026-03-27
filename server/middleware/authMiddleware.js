import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ 1. Check Header (Bearer)
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ✅ 2. Check Cookie (fallback)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // console.log("Token:", token);

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};