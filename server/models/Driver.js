import mongoose from "mongoose";
const driverSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  email: String,
  profile: String,
  password: String,
  license: String,
  vehicleNo: String,
  vehicleType: String,
  vehicleColor: String,
  rating: String,
  status: String,
  state: String,
  city: String,
  role: {
  type: String,
  default: "driver"
},
  rating:{
    type:Number,
    default:0
  },
  status:{
    type:String,
    default:"offline",
    enum:["online","offline","onTrip"]
  },
  lastseen:{
    type:Date,
    default:Date.now
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
 payroll: {
  month: String,
  status: {
    type: String,
    default: "Pending",
  },
  paidDate: String,
  baseSalary: Number,
  incentive: Number,
  bonus: Number,
  deductions: Number,
  finalSalary: Number,
  paidAmount: {
    type: Number,
    default: 0,
  },
}
});

export default mongoose.model("Driver", driverSchema);
