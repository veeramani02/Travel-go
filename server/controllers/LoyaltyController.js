import Loyalty from "../models/Loyalty.js";
import Voucher from "../models/Voucher.js";
import { generateVoucherCode } from "../utils/generateVoucherCode.js";


//  GET LOYALTY DATA
export const getLoyaltyData = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const logs = await Loyalty.find({ userId }).sort({ createdAt: -1 });

    const totalPoints = logs.reduce((acc, item) => acc + item.points, 0);

    res.json({
      totalPoints,
      history: logs.slice(0, 3),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//  REDEEM VOUCHER
export const redeemVoucher = async (req, res) => {
  try {
    const { pointsRequired } = req.body;

    const userId = req.user.id || req.user._id;

    if (!pointsRequired || pointsRequired <= 0) {
      return res.status(400).json({ msg: "Invalid points" });
    }

    const logs = await Loyalty.find({ userId });
    const totalPoints = logs.reduce((acc, item) => acc + item.points, 0);

    if (totalPoints < pointsRequired) {
      return res.status(400).json({ msg: "Not enough points" });
    }

    const rewardMap = {
      500: 5,
      1000: 10,
      1500: 20,
    };

    const discount = rewardMap[pointsRequired];

    if (!discount) {
      return res.status(400).json({ msg: "Invalid redemption value" });
    }

    // deduct points
    await Loyalty.create({
      userId,
      activity: "Redeemed Voucher",
      points: -pointsRequired,
    });

    //  safe unique code
    let code;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      code = generateVoucherCode();
      const existing = await Voucher.findOne({ code });

      if (!existing) isUnique = true;

      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ msg: "Try again" });
    }

    const voucher = await Voucher.create({
      userId,
      code,
      discount,
    });

    res.json({
      msg: "Voucher redeemed successfully",
      code: voucher.code,
      discount: voucher.discount,
      expiry: voucher.expiryDate,
    });

  } catch (err) {
    console.log("REDEEM VOUCHER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};