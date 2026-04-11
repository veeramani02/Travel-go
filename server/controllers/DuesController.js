import Dues from "../models/Dues.js";
import Trip from "../models/Trip.js";
export const createDuePlan = async (req, res) => {
  try {
    const { tripID, months } = req.body;
    const userId = req.user._id;

    const trip = await Trip.findById(tripID);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const totalAmount = trip.totalAmount;


    const initialAmount = Math.floor(totalAmount * 0.3);

    const remainingAmount = totalAmount - initialAmount;
   const monthlyDue = Math.floor(remainingAmount / months);

    const duesPlan = new Dues({
      user: userId,
      tripId: tripID,
      totalAmount,
      paidAmount: initialAmount,
      remainingAmount,
      dueSchedule: [],
    });

    for (let i = 0; i < months; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i + 1);

      duesPlan.dueSchedule.push({
        dueDate,
        amount:
          i === months - 1
            ? remainingAmount - monthlyDue * (months - 1) 
            : monthlyDue,
        status: "pending",
      });
    }

    await duesPlan.save();

    return res.status(201).json({
      message: `₹${initialAmount} paid, remaining split into ${months} months`,
      duesPlan,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getUserDues = async (req, res) => {
  try {
    const userId = req.user._id;

    const dues = await Dues.find({ user: userId })
      .populate("tripId");

    return res.status(200).json({ dues });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const payDue = async (req, res) => {
  try {
    const { dueId, scheduleIndex } = req.params;

    const due = await Dues.findById(dueId);

    if (!due) {
      return res.status(404).json({ message: "Due not found" });
    }

    const selectedDue = due.dueSchedule[scheduleIndex];

    if (!selectedDue) {
      return res.status(404).json({ message: "Due schedule not found" });
    }

    if (selectedDue.status === "Paid") {
      return res.status(400).json({ message: "Already paid" });
    }
      selectedDue.status = "Paid";
    due.paidAmount += selectedDue.amount;
    due.remainingAmount -= selectedDue.amount;

    await due.save();

    return res.status(200).json({
      message: "Due paid successfully",
      due,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getUpcomingDues = async (req, res) => {
  try {
    const userId = req.user._id;

    const dues = await Dues.find({ user: userId });

    let upcomingDues = [];

    dues.forEach((due) => {
      due.dueSchedule.forEach((schedule) => {
        if (schedule.status === "Pending") {
          upcomingDues.push({
            tripId: due.tripId,
            dueDate: schedule.dueDate,
            amount: schedule.amount,
          });
        }
      });
    });

    return res.status(200).json({ upcomingDues });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const payAllDues = async (req, res) => {
  try{
    const { dueId } = req.params;
    const   due=await Dues.findById(dueId);
    if(!due)    {
      return res.status(404).json({ message: "Due not found" });
    }
    let totalPaid=0;
    due .dueSchedule.forEach((schedule)=>{
      if(schedule.status==="Pending"){
        schedule.status="Paid";
        totalPaid+=schedule.amount;
      }
  });  due.paidAmount+=totalPaid;
  due.remainingAmount-=totalPaid;
  await due.save();
  res.json({ message: "All dues paid successfully", due });
  }

  
  catch(error){ 
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
