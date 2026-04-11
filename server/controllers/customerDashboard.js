import Trip from "../models/Trip.js";
import Loyalty from "../models/Loyalty.js";
import Dues from "../models/Dues.js";

export const getCustomerDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const trips = await Trip.find({ userId }).sort({ startDate: 1 });

    const totalTrips = trips.length;

    const now = new Date();

const upcomingTrip = trips
  .filter((t) => new Date(t.startDate) >= now && t.status !== "Completed")
  .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0] || null;
    const lastTrips = [...trips]
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .slice(0, 3);
     const loyalty = await Loyalty.findOne({ userId });
    const dues = await Dues.find({ userId });
    let pendingAmount = 0;
    dues.forEach((due) => {
      due.dueSchedule?.forEach((d) => {
        if (d.status === "Pending") {
          pendingAmount += d.amount;
        }
      });
    });
    res.json({
      totalTrips,
      upcomingTrip,
      lastTrips,
      loyaltyPoints: loyalty?.points || 0,
      pendingAmount,
      upcomingSchedule: upcomingTrip?.schedule || [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Dashboard error" });
  }
};