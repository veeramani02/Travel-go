import express from "express";
import connectDB from "./Config/db.js";
import dotenv from "dotenv";
import router from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cors from "cors";
import triprouter from "./routes/tripRoutes.js";
import cookieParser from "cookie-parser";
import driverRouter from "./routes/driverRoutes.js";
import PaymentRouter from "./routes/PaymentRoutes.js";
import loyaltyrouter from "./routes/LoyaltyRoutes.js";
import voucherRoute from "./routes/voucherRoutes.js";
dotenv.config();
const app = express();
const PORT = 3000;
app.use(express.json());
connectDB();
app.use(cookieParser());
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "hello",
  });
});
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", router);
app.use("/api/user", userRouter);
app.use("/api/trip", triprouter);
app.use("/uploads", express.static("uploads"));
app.use("/api/driver", driverRouter);
app.use("/api/payments",PaymentRouter)
app.use("/api/loyalty",loyaltyrouter)
app.use("/api/voucher",voucherRoute)
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
