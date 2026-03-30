import Payment from "../models/Payment.js";
import Trip from "../models/Trip.js";
import mongoose from "mongoose";


//  CREATE PAYMENT
export const createPayment = async (req, res) => {
  try {
    const { tripId, amount, paymentMethod } = req.body;

    const userId = req.user.id || req.user._id;

    //  Validate tripId
    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: "Invalid Trip ID" });
    }

    //  Check trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const payment = new Payment({
      userId,
      tripId,
      amount,
      paymentMethod,
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
    const { status, transactionId } = req.body;

    //  Validate paymentId
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ message: "Invalid Payment ID" });
    }

    //  Fetch payment
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    //  Update fields
    payment.paymentStatus = status;

    if (transactionId) {
      payment.transactionId = transactionId;
    }

    await payment.save();

    //  If payment success → confirm trip
    if (status === "Completed") {
      await Trip.findByIdAndUpdate(payment.tripId, {
        status: "Confirmed",
      });
    }

    res.json({
      message: "Payment updated successfully",
      payment,
    });

  } catch (error) {
    console.log("UPDATE PAYMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



//  GET ALL USER PAYMENTS
export const getUserPayments = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const payments = await Payment.find({ userId })
      .populate("tripId")
      .sort({ createdAt: -1 });

    res.json(payments);

  } catch (error) {
    console.log("GET USER PAYMENTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



//  GET SINGLE PAYMENT
export const getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    //  Validate ID
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