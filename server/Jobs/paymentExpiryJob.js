import cron from "node-cron";
import Trip from "../models/Trip.js";

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const result = await Trip.updateMany(
      {
        paymentStatus: "pending",
        paymentExpiresAt: { $lte: now },
        status: "pending",
      },
      {
        $set: {
          paymentStatus: "failed",
          status: "failed",
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`${result.modifiedCount} trips marked failed`);
    }
  } catch (err) {
    console.log("PAYMENT EXPIRY ERROR", err);
  }
});