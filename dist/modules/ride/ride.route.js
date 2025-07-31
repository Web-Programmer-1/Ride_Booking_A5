"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const role_middleware_1 = require("../../middlewares/role.middleware");
const ride_controller_1 = require("./ride.controller");
const validate_request_1 = require("../../middlewares/validate.request");
const ride_validate_1 = require("./ride.validate");
const rideRouter = express_1.default.Router();
rideRouter.post("/request", (0, validate_request_1.validateRequest)(ride_validate_1.rideRequestSchema), auth_middleware_1.authGuard, (0, role_middleware_1.checkRole)(['rider']), ride_controller_1.rideRequest);
rideRouter.patch("/cancel/:id", auth_middleware_1.authGuard, (0, role_middleware_1.checkRole)(['rider']), ride_controller_1.cancelRide);
rideRouter.get("/history", auth_middleware_1.authGuard, (0, role_middleware_1.checkRole)(['rider']), ride_controller_1.getRideHistory);
// Driver Controlls 
rideRouter.patch("/accept/:id", auth_middleware_1.authGuard, (0, role_middleware_1.checkRole)(['driver']), ride_controller_1.acceptRide);
rideRouter.patch("/status/:id", auth_middleware_1.authGuard, (0, role_middleware_1.checkRole)(['driver']), ride_controller_1.updateRideStatus);
exports.default = rideRouter;
rideRouter.get("/earnings", auth_middleware_1.authGuard, (0, role_middleware_1.checkRole)(['driver']), ride_controller_1.getEarning);
rideRouter.patch('/availability', auth_middleware_1.authGuard, (0, role_middleware_1.checkRole)(['driver']), ride_controller_1.toggleAvailability);
// --------------ADMIN Opearation--------------------------
rideRouter.get("/users", auth_middleware_1.authGuard, (0, role_middleware_1.checkRole)(['admin']), ride_controller_1.getAllUsers);
rideRouter.patch('/drivers/approve/:id', auth_middleware_1.authGuard, (0, role_middleware_1.checkRole)(['admin']), ride_controller_1.approveDriver);
rideRouter.patch('/users/block/:id', auth_middleware_1.authGuard, (0, role_middleware_1.checkRole)(['admin']), ride_controller_1.blockUser);
rideRouter.get("/rides", auth_middleware_1.authGuard, (0, role_middleware_1.checkRole)(['admin']), ride_controller_1.getAllRides);
