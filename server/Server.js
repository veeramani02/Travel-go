import express from "express"
import connectDB from "./Config/db.js";
import dotenv from "dotenv"
import router from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import Driver from "./models/Driver.js";

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
    origin: "http://localhost:5173",
    credentials: true, 
  })
);
app.use("/api/auth",router)
app.use("/api/user",userRouter)

app.post("/add", async (req, res) => {
    console.log(req.body);
    const driver = new Driver(req.body);
    await driver.save();
    res.send("Driver added");
  });

app.get("/driver", async (req, res) => {
  const driver = await Driver.find();
  res.json(driver);
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Driver.findByIdAndDelete(id);
    res.send("Driver deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting driver");
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("file"), (req, res) => {
  try{
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({
    url: fileUrl,
  });
}catch(e){
  console.log(e.message)
}
});
