import Voucher from "../models/Voucher.js";

export const applyVoucher = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id || req.user._id;

    const voucher = await Voucher.findOne({
      code,
      userId,
      isUsed: false,
    });

    if (!voucher) {
      return res.status(404).json({ msg: "Invalid or already used voucher" });
    }

    if (voucher.expiryDate < new Date()) {
      return res.status(400).json({ msg: "Voucher expired" });
    }

    res.json({
      discount: voucher.discount,
      code: voucher.code,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};