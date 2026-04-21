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
import vehicleRoutes from "./routes/vehicleRoutes.js";

import loyaltyrouter from "./routes/LoyaltyRoutes.js";
import voucherRoute from "./routes/voucherRoutes.js";
import dueRouter from "./routes/dueRoutes.js";
import custRouter from "./routes/custRoutes.js";
import NotifyRoutes from "./routes/NotifyRoutes.js";
import { startDriverStatusChecker } from "./utils/driverStatusChecker.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
connectDB();
startDriverStatusChecker();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use("/api/auth", router);
app.use("/api/user", userRouter);
app.use("/api/trip", triprouter);
app.use("/uploads", express.static("uploads"));
app.use("/api/driver", driverRouter);
app.use("/api/payments", PaymentRouter);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/payments", PaymentRouter);
app.use("/api/loyalty", loyaltyrouter);
app.use("/api/voucher", voucherRoute);
app.use("/api/due", dueRouter);
app.use("/api/dashboard", custRouter);
app.use("/api/notify", NotifyRoutes);
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
