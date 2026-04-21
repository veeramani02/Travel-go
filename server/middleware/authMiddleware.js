import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Driver from "../models/Driver.js";
export const protect = async (req, res, next) => {
  try {
    let token;
      if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      }
      if (!token && req.cookies?.token) {
      token = req.cookies.token;
      }
      if (!token) {
      return res.status(401).json({ message: "No token" });
      }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === "driver") {
      req.user = await Driver.findById(decoded.id);
      }      
      else {
      req.user = await User.findById(decoded.id).select("-password");
      }
    next();
  } 
  catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};
