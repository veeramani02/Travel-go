import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "driver", "admin"],
      default: "customer",
    },
    profile: String,
    emailNotify: { type: Boolean, default: true },
    pushNotify: { type: Boolean, default: false },
    smsNotify: { type: Boolean, default: false },
    twoStepVerification: { type: Boolean, default: false },
    passwordChangedAt: Date,
  },
  { timestamps: true },
);
export default mongoose.model("User", userSchema);
