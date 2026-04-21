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

});

export default mongoose.model("Driver", driverSchema);
