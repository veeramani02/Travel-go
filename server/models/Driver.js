import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  email: String,
  profile: String,
  license: String,
  vehicle: String,
  rating: String,
  status: String,
  joinedDate: {
  type: Date,
  default: Date.now
},
});

export default mongoose.model("Driver", driverSchema);