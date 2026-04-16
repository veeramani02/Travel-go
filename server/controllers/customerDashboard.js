import Trip from "../models/Trip.js";
import Loyalty from "../models/Loyalty.js";
import Dues from "../models/Dues.js";
export const getCustomerDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const trips = await Trip.find({ userId }).sort({ startDate: 1 });
    const totalTrips = trips.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentTrip = trips.find((t) => {
       if (!t.dateAndTime) return false;
       const tripDate = new Date(t.dateAndTime);
       tripDate.setHours(0, 0, 0, 0);
       return (
        tripDate.getTime() === today.getTime() &&
        t.status !== "completed"
      );
    });
    const upcomingTrip = trips
      .filter((t) => {
        if (!t.dateAndTime) return false;
        const tripDate = new Date(t.dateAndTime);
        return tripDate > today && t.status !== "completed";
      })
    .sort((a, b) => new Date(a.dateAndTime) - new Date(b.dateAndTime))[0] || null;
    const finalUpcomingTrip = currentTrip || upcomingTrip || null;
    const lastTrips = [...trips]
    .filter((t) => {
        if (!t.dateAndTime) return false;
        const tripDate = new Date(t.dateAndTime);
        return tripDate < today || t.status === "completed";
      })
    .sort((a, b) => new Date(b.dateAndTime) - new Date(a.dateAndTime))
    .slice(0, 3);
    const loyaltyLogs = await Loyalty.find({ userId });
    const loyaltyPoints = loyaltyLogs.reduce((acc, log) => acc + log.points, 0);
    const dues = await Dues.find({ user: userId });
    let pendingAmount = 0;
    dues.forEach((due) => {
    due.dueSchedule?.forEach((d) => {
        if (d.status === "pending" || d.status === "Pending") {
          pendingAmount += d.amount;
        }
      });
    });
    res.json({
    totalTrips,
    upcomingTrip: finalUpcomingTrip
      ? {
          id: finalUpcomingTrip._id,
          from: `${finalUpcomingTrip.pickupCity}, ${finalUpcomingTrip.pickupState}`,
          to: `${finalUpcomingTrip.destinationCity}, ${finalUpcomingTrip.destinationState}`,
          startDate: finalUpcomingTrip.dateAndTime,
          vehicle: finalUpcomingTrip.vehicleType,
          status: finalUpcomingTrip.status,
          passengers: finalUpcomingTrip.passengers,
          }
      : null,
          lastTrips: lastTrips.map((trip) => ({
          _id: trip._id,
          from: `${trip.pickupCity}, ${trip.pickupState}`,
          to: `${trip.destinationCity}, ${trip.destinationState}`,
          startDate: trip.dateAndTime,
          vehicle: trip.vehicleType,
          price: trip.amount,
          status: trip.status,
      })),
    loyaltyPoints,
    pendingAmount,
    upcomingSchedule: finalUpcomingTrip?.schedule || [],
    });
  } 
  catch (error) {
    console.log("Dashboard Error:", error);
    res.status(500).json({ message: "Dashboard error" });
  }
};