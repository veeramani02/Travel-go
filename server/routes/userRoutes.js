import express from "express"
import {protect} from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"
const userRouter=express.Router()


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
userRouter.get("/driver",protect,authorizeRoles("driver"),(req,res)=>{
    res.json({message:"Welcome Driver"})
})
export default userRouter