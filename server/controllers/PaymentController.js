import Payment from "../models/Payment.js";
import Trip from "../models/Trip.js";
import mongoose from "mongoose";
import Loyalty from "../models/Loyalty.js";
import Voucher from "../models/Voucher.js";
import Dues from "../models/Dues.js";

export const createPayment = async (req, res) => {
  try {
    const { tripId, paymentMethod, voucherCode, months } = req.body;

    const userId = req.user.id || req.user._id;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid Trip ID" });
    }

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    let finalAmount = trip.amount || 0;
    if (voucherCode) {
      const voucher = await Voucher.findOne({
        code: voucherCode,
        userId,
        isUsed: false,
      });

      if (voucher && voucher.expiryDate > new Date()) {
        const discountAmount = (finalAmount * voucher.discount) / 100;
        finalAmount -= discountAmount;
      }
    }

    let paymentAmount = finalAmount;

    if (paymentMethod === "dues") {

      if (!months) {
        return res.status(400).json({ message: "Months required" });
      }

      const initialAmount = Math.floor(finalAmount * 0.3);

      const remainingAmount = finalAmount - initialAmount;

      const monthlyDue = Math.floor(remainingAmount / months);

      let dueSchedule = [];

 
      for (let i = 0; i < months; i++) {
  const dueDate = new Date();

 
  dueDate.setMonth(dueDate.getMonth() + i + 1);

 
  dueDate.setDate(3);

  dueSchedule.push({
    dueDate,
    amount:
      i === months - 1
        ? remainingAmount - monthlyDue * (months - 1)
        : monthlyDue,
    status: "Pending",
  });
}
      const due = new Dues({
        user: userId,
        tripId,
        totalAmount: finalAmount,
        paidAmount: initialAmount,
        remainingAmount,
        dueSchedule,
      });

      await due.save();

      console.log("✅ DUE SAVED:", due);

      paymentAmount = initialAmount;
    }

    const payment = new Payment({
      userId,
      tripId,
      amount: paymentAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "dues" ? "Partial" : "Pending",
    });

    await payment.save();

    res.status(201).json({
      message: "Payment created successfully",
      payment,
    });

  } catch (error) {
    console.log("CREATE PAYMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, transactionId, voucherCode } = req.body;

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ message: "Invalid Payment ID" });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const alreadyCompleted = payment.paymentStatus === "Completed";

    payment.paymentStatus = status;

    if (transactionId) {
      payment.transactionId = transactionId;
    }

    await payment.save();

    let earnedPoints = 0;

    if (status === "Completed" && !alreadyCompleted) {

      await Trip.findByIdAndUpdate(payment.tripId, {
        status: "Confirmed",
      });

      earnedPoints = Math.floor(Math.random() * 200) + 50;

      await Loyalty.create({
        userId: payment.userId,
        activity: "Payment",
        points: earnedPoints,
      });
      if (voucherCode) {
        const voucher = await Voucher.findOne({
          code: voucherCode,
          userId: payment.userId,
          isUsed: false,
        });

        if (voucher && voucher.expiryDate > new Date()) {
          voucher.isUsed = true;
          await voucher.save();
        }
      }
    }

    res.json({
      message: "Payment updated successfully",
      payment,
      earnedPoints,
    });

  } catch (error) {
    console.log("UPDATE PAYMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
export const getUserPayments = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const payments = await Payment.find({ userId })
      .populate("tripId")
      .sort({ createdAt: -1 });

    res.json({
      count: payments.length,
      payments,
    });

  } catch (error) {
    console.log("GET USER PAYMENTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
   if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ message: "Invalid Payment ID" });
    }

    const payment = await Payment.findById(paymentId)
      .populate("tripId");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);

  } catch (error) {
    console.log("GET PAYMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};