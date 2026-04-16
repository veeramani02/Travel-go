import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import userController from "../controllers/userController.js";
const userRouter = express.Router();

userRouter.get("/profile", protect, (req, res) => {
  res.json({
    message: "profile fetched",
    user: req.user,
  });
});

//  admin only
userRouter.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin " });
});

//driver
userRouter.get("/driver", protect, authorizeRoles("driver"), (req, res) => {
  res.json({ message: "Welcome Driver" });
});

userRouter.put("/update/:id", protect, userController.updateUser);
userRouter.post(
  "/uploads",
  protect,
  userController.uploadMiddleware,
  userController.uploadFiles,
);

export default userRouter;
