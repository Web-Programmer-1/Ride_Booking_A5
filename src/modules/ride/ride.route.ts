import express from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import { checkRole } from '../../middlewares/role.middleware';
import { rideRequest } from './ride.controller';

const rideRouter = express.Router();

rideRouter.post("/request", authGuard, checkRole(['rider']),rideRequest );


export default rideRouter;