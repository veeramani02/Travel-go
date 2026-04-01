import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  email: String,
  profile: String,
  license: String,
  vehicleNo: String,
  vehicleType: String,
  vehicleColor: String,
  rating: String,
  status: String,
  state: String,
  city: String,
  joinedDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Driver", driverSchema);
