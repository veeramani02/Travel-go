import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  try {
    //  token from cookie
    const token = req.cookies.token;

    // no token
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};
