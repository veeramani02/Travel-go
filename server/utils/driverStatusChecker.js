import Driver from "../models/Driver.js";

const startDriverStatusChecker = () => {
  setInterval(async () => {
    try {
      const drivers = await Driver.find();
      for (let driver of drivers) {
        if (!driver.lastSeen) continue;
        const diff = Date.now() - new Date(driver.lastSeen).getTime();
        if (diff > 60000 && driver.status === "online") {
          driver.status = "offline";
          await driver.save();
        }
      }
      // console.log("Driver status checked...");
    } catch (error) {
      console.error("Error checking driver status:", error.message);
    }
  }, 30000);
};

export default startDriverStatusChecker;
