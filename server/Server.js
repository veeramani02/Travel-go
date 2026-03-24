import express from "express"
import connectDB from "./Config/db.js";
import dotenv from "dotenv"
import router from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import cors from "cors"
dotenv.config()
const app=express();
const PORT=3000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
connectDB()

app.get("/",(req,res)=>{
    res.json({
        success:true,
        message:"hello"
    })
})
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, 
  })
);
app.use("/api/auth",router)
app.use("/api/user",userRouter)
