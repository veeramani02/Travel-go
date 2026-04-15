// // import Trip from "../models/Trip.js";
// // import Loyalty from "../models/Loyalty.js";
// // import Dues from "../models/Dues.js";

// // export const getCustomerDashboard = async (req, res) => {
// //   try {
// //     const userId = req.user._id;

// //     const trips = await Trip.find({ userId }).sort({ startDate: 1 });

// //     const totalTrips = trips.length;

// //     const now = new Date();

// // const upcomingTrip = trips
// //   .filter((t) => new Date(t.startDate) >= now && t.status !== "Completed")
// //   .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0] || null;
// //     const lastTrips = [...trips]
// //       .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
// //       .slice(0, 3);
// //      const loyalty = await Loyalty.findOne({ userId });
// //     const dues = await Dues.find({ userId });
// //     let pendingAmount = 0;
// //     dues.forEach((due) => {
// //       due.dueSchedule?.forEach((d) => {
// //         if (d.status === "Pending") {
// //           pendingAmount += d.amount;
// //         }
// //       });
// //     });
// //     res.json({
// //       totalTrips,
// //       upcomingTrip,
// //       lastTrips,
// //       loyaltyPoints: loyalty?.points || 0,
// //       pendingAmount,
// //       upcomingSchedule: upcomingTrip?.schedule || [],
// //     });
// //   } catch (error) {
// //     console.log(error);
// //     res.status(500).json({ message: "Dashboard error" });
// //   }
// // };
// import Trip from "../models/Trip.js";
// import Loyalty from "../models/Loyalty.js";
// import Dues from "../models/Dues.js";

// export const getCustomerDashboard = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // ✅ get all trips
//     const trips = await Trip.find({ userId }).sort({ startDate: 1 });

//     const totalTrips = trips.length;

//     // ✅ today start (important fix)
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // ✅ upcoming trip safe filter
//     const upcomingTrip = trips
//       .filter((t) => {
//         if (!t.startDate) return false;

//         const tripDate = new Date(t.startDate);
//         return tripDate >= today && t.status !== "Completed";
//       })
//       .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0] || null;

//     // ✅ last 3 trips
//     const lastTrips = [...trips]
//       .filter((t) => t.startDate) // avoid invalid date
//       .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
//       .slice(0, 3);

//     // ✅ loyalty
//     const loyalty = await Loyalty.findOne({ userId });

//     // ✅ dues calculation
//     const dues = await Dues.find({ userId });
//     let pendingAmount = 0;

//     dues.forEach((due) => {
//       due.dueSchedule?.forEach((d) => {
//         if (d.status === "Pending") {
//           pendingAmount += d.amount;
//         }
//       });
//     });

//     // ✅ FINAL RESPONSE
//     res.json({
//       totalTrips,
//       upcomingTrip,
//       lastTrips,
//       loyaltyPoints: loyalty?.points || 0,
//       pendingAmount,
//       upcomingSchedule: upcomingTrip?.schedule || [],
//     });

//   } catch (error) {
//     console.log("Dashboard Error:", error);
//     res.status(500).json({ message: "Dashboard error" });
//   }
// };
import Trip from "../models/Trip.js";
import Loyalty from "../models/Loyalty.js";
import Dues from "../models/Dues.js";

export const getCustomerDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ Fetch all trips for this user
    const trips = await Trip.find({ userId }).sort({ startDate: 1 });

    const totalTrips = trips.length;

    // ✅ Today at midnight for clean date comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ===============================
    // ✅ 1. CURRENT TRIP (TODAY)
    // ===============================
    const currentTrip = trips.find((t) => {
      if (!t.dateAndTime) return false;
      const tripDate = new Date(t.dateAndTime);
      tripDate.setHours(0, 0, 0, 0);
      return (
        tripDate.getTime() === today.getTime() &&
        t.status !== "completed"
      );
    });

    // ===============================
    // ✅ 2. UPCOMING TRIP (FUTURE)
    // ===============================
    const upcomingTrip = trips
      .filter((t) => {
        if (!t.dateAndTime) return false;
        const tripDate = new Date(t.dateAndTime);
        return tripDate > today && t.status !== "completed";
      })
      .sort((a, b) => new Date(a.dateAndTime) - new Date(b.dateAndTime))[0] || null;

    // ===============================
    // ✅ PRIORITY: today's trip first, then future
    // ===============================
    const finalUpcomingTrip = currentTrip || upcomingTrip || null;

    // ===============================
    // ✅ LAST 3 COMPLETED / PAST TRIPS
    // ===============================
    const lastTrips = [...trips]
      .filter((t) => {
        if (!t.dateAndTime) return false;
        const tripDate = new Date(t.dateAndTime);
        // Only include trips in the past or completed ones
        return tripDate < today || t.status === "completed";
      })
      .sort((a, b) => new Date(b.dateAndTime) - new Date(a.dateAndTime))
      .slice(0, 3);

    // ===============================
    // ✅ LOYALTY POINTS
    // Fix: LoyaltyController stores multiple records per userId,
    //      so we sum all points across all records
    // ===============================
    const loyaltyLogs = await Loyalty.find({ userId });
    const loyaltyPoints = loyaltyLogs.reduce((acc, log) => acc + log.points, 0);

    // ===============================
    // ✅ PENDING DUES
    // Fix: DuesController uses { user: userId }, so we match that field
    // ===============================
    const dues = await Dues.find({ user: userId });
    let pendingAmount = 0;

    dues.forEach((due) => {
      due.dueSchedule?.forEach((d) => {
        // Fix: DuesController saves status as "pending" (lowercase)
        if (d.status === "pending" || d.status === "Pending") {
          pendingAmount += d.amount;
        }
      });
    });

    // ===============================
    // ✅ FINAL RESPONSE
    // Map Trip model fields to frontend-friendly names
    // ===============================
    res.json({
      totalTrips,

      upcomingTrip: finalUpcomingTrip
        ? {
            _id: finalUpcomingTrip._id,
            // Frontend reads .from and .to — map from Trip model fields
            from: `${finalUpcomingTrip.pickupCity}, ${finalUpcomingTrip.pickupState}`,
            to: `${finalUpcomingTrip.destinationCity}, ${finalUpcomingTrip.destinationState}`,
            // Frontend reads .startDate
            startDate: finalUpcomingTrip.dateAndTime,
            // Frontend reads .vehicle
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
        // Frontend reads .price — map from Trip model's amount
        price: trip.amount,
        status: trip.status,
      })),

      loyaltyPoints,
      pendingAmount,
      upcomingSchedule: finalUpcomingTrip?.schedule || [],
    });

  } catch (error) {
    console.log("Dashboard Error:", error);
    res.status(500).json({ message: "Dashboard error" });
  }
};