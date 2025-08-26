import express from 'express';
import { authGuard, AuthRequest } from '../../middlewares/auth.middleware';
import { checkRole } from '../../middlewares/role.middleware';
import { acceptRide, approveDriver, blockUser, cancelRide, getAdminProfile, getAllRideHistory, getAllRides, getAllUsers, getAnalytics, getDriverRideHistory, getDriverUpdateProfile, getEarning, getEarnings, getRideDetails, getRideHistory, getRideOversight, getTotalRides, rideRequest, toggleAvailability, updateAdminProfile, updateRideStatus } from './ride.controller';


const rideRouter = express.Router();










rideRouter.post("/request", authGuard, checkRole(['rider']),rideRequest );

rideRouter.patch("/cancel/:id", authGuard, checkRole(['rider']), cancelRide);

rideRouter.get("/history", authGuard, checkRole(['rider']), getRideHistory);


rideRouter.patch("/accept/:id", authGuard, checkRole(['driver']), acceptRide)

rideRouter.patch("/status/:id", authGuard, checkRole(['driver']), updateRideStatus)

rideRouter.get("/totalRide", authGuard, checkRole(["driver"]), getTotalRides)


rideRouter.patch('/availability', authGuard, checkRole(['driver']), toggleAvailability);








// --------------ADMIN Opearation--------------------------

rideRouter.get("/users", authGuard, checkRole(['admin']), getAllUsers);

rideRouter.patch('/drivers/approve/:id', authGuard, checkRole(['admin']), approveDriver);


rideRouter.patch('/users/block/:id', authGuard, checkRole(['admin']), blockUser);

rideRouter.get("/rides", authGuard, checkRole(['admin']),getAllRides );


rideRouter.get("/analytics", authGuard, checkRole(["admin"]),getAnalytics );

rideRouter.get("/oversight", authGuard, checkRole(["admin"]), getRideOversight);


rideRouter.get("/profile", authGuard, checkRole(["admin"]), getAdminProfile);
rideRouter.patch("/profile", authGuard, checkRole(["admin"]), updateAdminProfile);












rideRouter.get("/details/:id", authGuard, checkRole(["rider"]), getAllRideHistory);



rideRouter.get("/history/driver", authGuard, checkRole(['driver']), getDriverRideHistory);


rideRouter.get("/earnings", authGuard, checkRole(["driver"]), getEarnings);





rideRouter.patch(
  "/driver/profile",
  authGuard,
  checkRole(["driver"]),
  getDriverUpdateProfile
  
);



rideRouter.get("/details/:id", authGuard, getRideDetails);



export default rideRouter;