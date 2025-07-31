import express from 'express';
import { authGuard } from '../../middlewares/auth.middleware';
import { checkRole } from '../../middlewares/role.middleware';
import { acceptRide, approveDriver, blockUser, cancelRide, getAllRides, getAllUsers, getEarning, getRideHistory, rideRequest, toggleAvailability, updateRideStatus } from './ride.controller';
import { validateRequest } from '../../middlewares/validate.request';
import { rideRequestSchema } from './ride.validate';

const rideRouter = express.Router();

rideRouter.post("/request", authGuard, checkRole(['rider']),rideRequest );

rideRouter.patch("/cancel/:id", authGuard, checkRole(['rider']), cancelRide);

rideRouter.get("/history", authGuard, checkRole(['rider']), getRideHistory);

// Driver Controlls 
rideRouter.patch("/accept/:id", authGuard, checkRole(['driver']), acceptRide)

rideRouter.patch("/status/:id", authGuard, checkRole(['driver']), updateRideStatus)
export default rideRouter;

rideRouter.get("/earnings", authGuard, checkRole(['driver']), getEarning);

rideRouter.patch('/availability', authGuard, checkRole(['driver']), toggleAvailability);


// --------------ADMIN Opearation--------------------------

rideRouter.get("/users", authGuard, checkRole(['admin']), getAllUsers);

rideRouter.patch('/drivers/approve/:id', authGuard, checkRole(['admin']), approveDriver);


rideRouter.patch('/users/block/:id', authGuard, checkRole(['admin']), blockUser);

rideRouter.get("/rides", authGuard, checkRole(['admin']),getAllRides )