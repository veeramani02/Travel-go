import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  vehicleType: String,
  vehicleModel: String,
  vehicleColor: String,
  vehicleNo: String,
  seatCapacity: String,
  luggageCapacity: String,
  fuelType: String,
  AC: Boolean,
  frontView: String,
  sideView: String,
  interior: String,
  backView: String,
  status: String,
  document: String,
  policyNo: String,
});

export default mongoose.model("Vehicle", vehicleSchema);
