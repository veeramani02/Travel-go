import mongoose from "mongoose";
const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    pickupState: { type: String, required: true },
    pickupCity: { type: String, required: true },
    destinationState: { type: String, required: true },
    destinationCity: { type: String, required: true },
    dateAndTime: { type: Date, required: true },
    vehicleType: { type: String, required: true },
    passengers: { type: Number, required: true },
    specialRequest: { type: String },
    status: {
      type: String,
      enum: ["pending", "assigned", "current", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentExpiresAt: String,
    amount: { type: Number, default: 0 },
    driverId: String,
    vehicleId: String,
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
    },
    estimatedDuration: {
      type: Number,
      default: 0,
    },
    estimatedDistance: {
      type: Number,
      default: 0,
    },
    pickupCoordinates: {
      lat: {
        type: Number,
        default: 0,
      },
      lon: {
        type: Number,
        default: 0,
      },
    },

    destinationCoordinates: {
      lat: {
        type: Number,
        default: 0,
      },
      lon: {
        type: Number,
        default: 0,
      },
    },
  },

  { timestamps: true },
);
export default mongoose.model("Trip", tripSchema);
