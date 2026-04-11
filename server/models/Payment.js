import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip", 
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
       enum: ["card", "upi", "cash", "dues"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed","Partial"], 
      default: "Pending",
    },

    transactionId: { 
      type: String,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema); 