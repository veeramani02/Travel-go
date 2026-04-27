// // import jwt from "jsonwebtoken";
// // import User from "../models/user.js";
// // import Driver from "../models/Driver.js";
// // export const protect = async (req, res, next) => {
// //   try {
// //     let token;
// //       if (req.headers.authorization?.startsWith("Bearer")) {
// //       token = req.headers.authorization.split(" ")[1];
// //       }
// //       if (!token && req.cookies?.token) {
// //       token = req.cookies.token;
// //       }
// //       if (!token) {
// //       return res.status(401).json({ message: "No token" });
// //       }
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //       if (decoded.role === "driver") {
// //       req.user = await Driver.findById(decoded.id);
// //       }      
// //       else {
// //       req.user = await User.findById(decoded.id).select("-password");
// //       }
// //     next();
// //   } 
// //   catch (error) {
// //     res.status(401).json({ message: "Token failed" });
// //   }
// // };
// import jwt from "jsonwebtoken";
// import User from "../models/user.js";
// import Driver from "../models/Driver.js";

// export const protect = async (req, res, next) => {
//   try {
//     let token;

//     if (req.headers.authorization?.startsWith("Bearer")) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token && req.cookies?.token) {
//       token = req.cookies.token;
//     }

//     if (!token) {
//       return res.status(401).json({ message: "No token" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     let user;

//     if (decoded.role === "driver") {
//       user = await Driver.findById(decoded.id);
//     } else {
//       user = await User.findById(decoded.id).select("-password");
//     }

//     // 🔥 IMPORTANT CHECK
//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     console.log("Auth error:", error.message);
//     res.status(401).json({ message: "Token failed" });
//   }
// };
import User from "../models/user.js";
import Driver from "../models/Driver.js";
import jwt from "jsonwebtoken";
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


    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    if (user.role === "driver") {
      const driver = await Driver.findOne({ email: user.email });

      req.user = {
        ...user._doc,
        driverData: driver,
      };
    } else {
      req.user = user;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};