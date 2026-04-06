import express from 'express';
import { createDuePlan,getUserDues,getUpcomingDues,payDue } from '../controllers/DuesController.js';
import { protect } from '../middleware/authMiddleware.js';
const dueRouter = express.Router();
dueRouter.post('/create',protect,createDuePlan);
dueRouter.get('/user-dues',protect,getUserDues);
dueRouter.get('/upcoming',protect,getUpcomingDues);
dueRouter.post('/pay/:dueId/:scheduleIndex',protect,payDue);
export default dueRouter;