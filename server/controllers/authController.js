import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Driver from "../models/Driver.js";

export const signup = async (req, res) => {
  try {
    const { name, password, phone, email } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "customer", 
    });

    const { password: _, ...userData } = user._doc;

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
      if (!email || !password) {
      return res.status(400).json({ message: "Email & Password required" });
      }
    let user = await User.findOne({ email });
    // let role="user";
    //   if(!user){
    //   user = await Driver.findOne({ email });
    //   role="driver";
    //   }
    let role;


if (user) {
  role = user.role; 
} else {
  user = await Driver.findOne({ email });
  role = "driver";
}
      if (!user) {
      return res.status(404).json({ message: "User not found" }); 
      }
    const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
      }
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

  
    res.cookie("token", token, {
      httpOnly: true,      
      secure: false,       
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    const { password: _, ...userData } = user._doc;

    res.status(200).json({
      message: "Login successfully",
      user: userData,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT 
export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: "Logged out successfully" });
};