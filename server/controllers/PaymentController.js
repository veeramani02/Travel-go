import Payment from "../models/Payment.js";
import Trip from "../models/Trip.js";
import mongoose from "mongoose";
import Loyalty from "../models/Loyalty.js";
import Voucher from "../models/Voucher.js";

//  CREATE PAYMENT (SECURE)
export const createPayment = async (req, res) => {
  try {
    const { tripId, paymentMethod, voucherCode } = req.body;

    const userId = req.user.id || req.user._id;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid Trip ID" });
    }

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    //  SECURE AMOUNT
    let finalAmount = trip.amount || 0;

    //  APPLY VOUCHER (BACKEND SAFE)
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

    const payment = new Payment({
      userId,
      tripId,
      amount: finalAmount,
      paymentMethod,
      paymentStatus: "Pending",
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

// UPDATE PAYMENT STATUS
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
        status: "confirmed",
      });

      earnedPoints = Math.floor(Math.random() * 200) + 50;

      await Loyalty.create({
        userId: payment.userId,
        activity: "Payment",
        points: earnedPoints,
      });

      //  MARK VOUCHER USED
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
//  GET CURRENT USER PAYMENTS
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
//  GET SINGLE PAYMENT
export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    //  validate id
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ message: "Invalid Payment ID" });
    }

    const payment = await Payment.findById(paymentId).populate("tripId");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    console.log("GET PAYMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
