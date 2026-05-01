import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Driver from "../models/Driver.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
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


export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: "Logged out successfully" });
};
export const forgotPassword=async(req,res)=>{
  try{
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken=resetToken;
    user.resetPasswordExpires=Date.now() +15*60*1000;
    await user.save();
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport(
      {
        service:"gmail",
        auth:{
          user:process.env.EMAIL_USER,
          pass:process.env.EMAIL_PASS,
        },
      }
    )
    await transporter.sendMail({
      to:user.email,
      subject:"Password Reset",
      html:`<p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>`,
    })
    res.status(200).json({ message: "Password reset email sent" });
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
}
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};