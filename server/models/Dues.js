import Mongoose from 'mongoose';

const duesSchema = new Mongoose.Schema({
    user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tripId:{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    totalAmount: Number,
    paidAmount:{
        type:Number,
        default:0,
    },
    remainingAmount:Number,
    duesSchedule:[
       {
        dueDate: Date,
        amount:Number,
        status:{
            type:String,
            enum:['Pending','Paid'],
            default:'Pending',
        },
       },],
    }, { timestamps: true });

export default  Mongoose.model('Dues', duesSchema); 
